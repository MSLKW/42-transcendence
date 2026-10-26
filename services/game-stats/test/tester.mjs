// services/game-stats/test/tester.mjs
//
// Plain Node script (Node 18+, no installs). Prints PASS / FAIL for every game-stats endpoint.
//
// Run from the repo root:
//   COOKIE='<paste your cookie header>' node services/game-stats/test/tester.mjs
//
// Optional env vars:
//   DIRECT_URL        default http://127.0.0.1:3002            (game-stats port you published in compose)
//   NGINX_URL         default http://localhost:8080/api/game-stats
//   STATISTICS_TOKEN  default: read from secrets/tokens/statistics-token.txt
//   PLAYER_UUID       default: read from your own data (needs COOKIE)
//
// WARNING: this WRITES test data (XP, 1 game played, achievement first_win) to the
// account of the cookie you give. Use a throwaway test account.

import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const DIRECT = process.env.DIRECT_URL ?? "http://127.0.0.1:3002";
const NGINX = process.env.NGINX_URL ?? "http://localhost:8080/api/game-stats";
const COOKIE = process.env.COOKIE ?? "";

function loadToken()
{
	if (process.env.STATISTICS_TOKEN)
		return (process.env.STATISTICS_TOKEN.trim());
	const here = path.dirname(fileURLToPath(import.meta.url));
	const file = path.resolve(here, "../../../secrets/tokens/statistics-token.txt");
	return (readFileSync(file, "utf-8").trim());
}
const TOKEN = loadToken();


// ---------- tiny helpers ----------

async function call(base, method, route, { body, raw, cookie, token } = {})
{
	const headers = {};
	if (body !== undefined || raw !== undefined)
		headers["Content-Type"] = "application/json";
	if (cookie)
		headers.Cookie = cookie;
	if (token)
		headers.Authorization = `Bearer ${token}`;

	const res = await fetch(base + route, {
		method,
		headers,
		body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined),
		signal: AbortSignal.timeout(5000),
	});
	const text = await res.text();
	let json = null;
	try { json = JSON.parse(text); } catch { /* not json */ }
	return ({ status: res.status, json, text });
}

let passed = 0;
let failed = 0;
let skipped = 0;

async function test(name, fn)
{
	try
	{
		await fn();
		console.log(`PASS  ${name}`);
		passed++;
	}
	catch (e)
	{
		console.log(`FAIL  ${name}\n        -> ${e.message}`);
		failed++;
	}
}

function skip(name, why)
{
	console.log(`SKIP  ${name}  (${why})`);
	skipped++;
}

function expect(cond, msg)
{
	if (!cond)
		throw new Error(msg);
}

function expectStatus(r, status)
{
	expect(r.status === status, `expected HTTP ${status}, got ${r.status}: ${r.text.slice(0, 200)}`);
}

function endPayload(roundId, uuid, xp = 50)
{
	return ({
		uuid: roundId,
		winnerPlayerUuid: uuid,
		playerFinalCardAmounts: { [uuid]: 0 },
		playerPenaltyPoints: { [uuid]: 0 },
		playerXpGains: { [uuid]: xp },
		temporaryWinStreakAmount: 1,
		temporaryRoundsPlayed: 1,
	});
}


// ---------- setup ----------

console.log(`direct: ${DIRECT}\nnginx:  ${NGINX}\ncookie: ${COOKIE ? "provided" : "NOT provided (cookie tests will be skipped)"}\n`);

let me = null; // own-player-game-data response
let playerUuid = process.env.PLAYER_UUID ?? null;

if (COOKIE)
{
	try
	{
		const r = await call(DIRECT, "GET", "/own-player-game-data", { cookie: COOKIE });
		if (r.status === 200 && r.json)
		{
			me = r.json;
			playerUuid = playerUuid ?? me.stats?.playerUuid ?? null;
		}
		else
			console.log(`setup: own-player-game-data answered ${r.status}, cookie may be expired. ${r.text.slice(0, 120)}\n`);
	}
	catch (e)
	{
		console.log(`setup: cannot reach ${DIRECT} (${e.message}). Did you add the ports line to compose?\n`);
	}
}


// ---------- 1. INTERNAL endpoints (Bearer token), direct port ----------

console.log("--- internal: health ---");

await test("GET /health -> 200 healthy", async () =>
{
	const r = await call(DIRECT, "GET", "/health");
	expectStatus(r, 200);
	expect(r.json?.status === "healthy", `status field is ${r.json?.status}`);
});

console.log("\n--- internal: POST /game-end-stats ---");

await test("no token -> 401", async () =>
{
	const r = await call(DIRECT, "POST", "/game-end-stats", { body: endPayload(randomUUID(), randomUUID()) });
	expectStatus(r, 401);
});

await test("wrong token -> 401", async () =>
{
	const r = await call(DIRECT, "POST", "/game-end-stats", { token: "wrong-token", body: endPayload(randomUUID(), randomUUID()) });
	expectStatus(r, 401);
});

await test("malformed JSON -> 400 invalid_request_body", async () =>
{
	const r = await call(DIRECT, "POST", "/game-end-stats", { token: TOKEN, raw: "{bad json" });
	expectStatus(r, 400);
	expect(r.json?.error === "invalid_request_body", `error field is ${r.json?.error}`);
});

await test("body with wrong shape -> 400 invalid_request_body", async () =>
{
	const r = await call(DIRECT, "POST", "/game-end-stats", { token: TOKEN, body: { hello: "world" } });
	expectStatus(r, 400);
	expect(r.json?.error === "invalid_request_body", `error field is ${r.json?.error}`);
});

await test("winner not among players -> 400 winner_is_not_among_players", async () =>
{
	const a = randomUUID();
	const payload = endPayload(randomUUID(), a);
	payload.winnerPlayerUuid = randomUUID();
	const r = await call(DIRECT, "POST", "/game-end-stats", { token: TOKEN, body: payload });
	expectStatus(r, 400);
	expect(r.json?.error === "winner_is_not_among_players", `error field is ${r.json?.error}`);
});

await test("unknown player uuid -> 404 invalid_player_uuid", async () =>
{
	const a = randomUUID();
	const r = await call(DIRECT, "POST", "/game-end-stats", { token: TOKEN, body: endPayload(randomUUID(), a) });
	expectStatus(r, 404);
	expect(r.json?.error === "invalid_player_uuid", `error field is ${r.json?.error}`);
});

if (playerUuid)
{
	const roundId = randomUUID();
	let afterFirst = null;

	await test("valid round -> 200 with accumulated stats for the player", async () =>
	{
		const r = await call(DIRECT, "POST", "/game-end-stats", { token: TOKEN, body: endPayload(roundId, playerUuid, 50) });
		expectStatus(r, 200);
		expect(r.json?.roundId === roundId, "roundId missing in response");
		const result = r.json?.playerAccumulatedStats?.[playerUuid];
		expect(result, "player missing in playerAccumulatedStats");
		expect(result.stats && result.levelProgress, "stats / levelProgress missing");
		expect(typeof result.isLeveledUp === "boolean", "isLeveledUp is not a boolean");
		expect(Array.isArray(result.newlyGrantedBadgeIdsForStats), "newlyGrantedBadgeIdsForStats is not an array");
		expect(!("updatedAt" in result.stats), "updatedAt leaked into the response");
		afterFirst = result.stats;
	});

	await test("same round sent again is NOT counted twice (idempotent)", async () =>
	{
		expect(afterFirst, "previous test failed, nothing to compare");
		const r = await call(DIRECT, "POST", "/game-end-stats", { token: TOKEN, body: endPayload(roundId, playerUuid, 50) });
		expect(r.status >= 200 && r.status < 300, `replay answered ${r.status}: ${r.text.slice(0, 200)}`);
		const after = await call(DIRECT, "GET", "/public-player-game-data/" + playerUuid);
		expectStatus(after, 200);
		expect(after.json.stats.totalPlayed === afterFirst.totalPlayed,
			`totalPlayed went ${afterFirst.totalPlayed} -> ${after.json.stats.totalPlayed} after the replay`);
		expect(after.json.stats.xp === afterFirst.xp,
			`xp went ${afterFirst.xp} -> ${after.json.stats.xp} after the replay`);
	});
}
else
{
	skip("valid round / idempotency", "no PLAYER_UUID and no COOKIE to find one");
}

console.log("\n--- internal: POST /achievement-unlocked ---");

await test("no token -> 401", async () =>
{
	const r = await call(DIRECT, "POST", "/achievement-unlocked", { body: { playerUuid: randomUUID(), achievementId: "first_win" } });
	expectStatus(r, 401);
});

await test("invalid achievementId -> 400", async () =>
{
	const r = await call(DIRECT, "POST", "/achievement-unlocked", { token: TOKEN, body: { playerUuid: randomUUID(), achievementId: "bogus" } });
	expectStatus(r, 400);
});

await test("unknown player uuid -> 404 invalid_player_uuid", async () =>
{
	const r = await call(DIRECT, "POST", "/achievement-unlocked", { token: TOKEN, body: { playerUuid: randomUUID(), achievementId: "first_win" } });
	expectStatus(r, 404);
	expect(r.json?.error === "invalid_player_uuid", `error field is ${r.json?.error}`);
});

if (playerUuid)
{
	await test("first_win twice: second time isNewlyGrantedAchievement is false", async () =>
	{
		const body = { playerUuid, achievementId: "first_win" };
		const r1 = await call(DIRECT, "POST", "/achievement-unlocked", { token: TOKEN, body });
		expectStatus(r1, 200);
		expect(typeof r1.json?.isNewlyGrantedAchievement === "boolean", "isNewlyGrantedAchievement is not a boolean");
		const r2 = await call(DIRECT, "POST", "/achievement-unlocked", { token: TOKEN, body });
		expectStatus(r2, 200);
		expect(r2.json.isNewlyGrantedAchievement === false, "second call still says newly granted");
	});
}
else
	skip("first_win twice", "no PLAYER_UUID and no COOKIE to find one");


// ---------- 2. BROWSER-FACING endpoints (cookie), direct port ----------

console.log("\n--- browser-facing: no cookie ---");

await test("GET /own-player-game-data without cookie -> 401", async () =>
{
	expectStatus(await call(DIRECT, "GET", "/own-player-game-data"), 401);
});

await test("PUT /displayed-badge without cookie -> 401", async () =>
{
	expectStatus(await call(DIRECT, "PUT", "/displayed-badge", { body: { badgeId: "fresh_deal" } }), 401);
});

await test("POST /easter-egg-found without cookie -> 401", async () =>
{
	expectStatus(await call(DIRECT, "POST", "/easter-egg-found", { body: { eggId: "x" } }), 401);
});

console.log("\n--- browser-facing: public data (no cookie needed) ---");

await test("GET /public-player-game-data/not-a-uuid -> 400", async () =>
{
	const r = await call(DIRECT, "GET", "/public-player-game-data/not-a-uuid");
	expectStatus(r, 400);
	expect(r.json?.error === "invalid_player_uuid", `error field is ${r.json?.error}`);
});

await test("GET /public-player-game-data/<unknown uuid> -> 404", async () =>
{
	const r = await call(DIRECT, "GET", "/public-player-game-data/" + randomUUID());
	expectStatus(r, 404);
});

if (playerUuid)
{
	await test("GET /public-player-game-data/<real uuid> -> 200 and NO badges", async () =>
	{
		const r = await call(DIRECT, "GET", "/public-player-game-data/" + playerUuid);
		expectStatus(r, 200);
		expect(r.json?.stats && r.json?.levelProgress && r.json?.achievements, "stats / levelProgress / achievements missing");
		expect(!("badges" in r.json), "public response leaks the badges list");
	});
}
else
	skip("public data of a real player", "no PLAYER_UUID and no COOKIE to find one");

console.log("\n--- browser-facing: with cookie ---");

if (!COOKIE || !me)
{
	skip("own data / displayed badge / easter egg", "no valid COOKIE");
}
else
{
	await test("GET /own-player-game-data -> 200 with stats, levelProgress, achievements, badges", async () =>
	{
		const r = await call(DIRECT, "GET", "/own-player-game-data", { cookie: COOKIE });
		expectStatus(r, 200);
		for (const key of ["stats", "levelProgress", "achievements", "badges"])
			expect(key in r.json, `"${key}" missing`);
	});

	await test("PUT /displayed-badge with unknown badge -> 400", async () =>
	{
		const r = await call(DIRECT, "PUT", "/displayed-badge", { cookie: COOKIE, body: { badgeId: "not_a_badge" } });
		expectStatus(r, 400);
	});

	const fresh = await call(DIRECT, "GET", "/own-player-game-data", { cookie: COOKIE });
	const badges = fresh.json?.badges ?? {};
	const unlocked = Object.keys(badges).find((k) => badges[k] === true);
	const locked = Object.keys(badges).find((k) => badges[k] === false);

	if (unlocked)
	{
		await test(`PUT /displayed-badge with unlocked badge (${unlocked}) -> 204`, async () =>
		{
			const r = await call(DIRECT, "PUT", "/displayed-badge", { cookie: COOKIE, body: { badgeId: unlocked } });
			expectStatus(r, 204);
		});
	}
	else
		skip("PUT /displayed-badge unlocked", "this account has no unlocked badge");

	if (locked)
	{
		await test(`PUT /displayed-badge with locked badge (${locked}) -> 403 badge_not_unlocked`, async () =>
		{
			const r = await call(DIRECT, "PUT", "/displayed-badge", { cookie: COOKIE, body: { badgeId: locked } });
			expectStatus(r, 403);
			expect(r.json?.error === "badge_not_unlocked", `error field is ${r.json?.error}`);
		});
	}
	else
		skip("PUT /displayed-badge locked", "this account has no locked badge");

	await test("POST /easter-egg-found with wrong body shape -> 400", async () =>
	{
		const r = await call(DIRECT, "POST", "/easter-egg-found", { cookie: COOKIE, body: { nope: 1 } });
		expectStatus(r, 400);
	});

	await test("POST /easter-egg-found with unknown egg id -> 404", async () =>
	{
		const r = await call(DIRECT, "POST", "/easter-egg-found", { cookie: COOKIE, body: { eggId: "this-egg-does-not-exist" } });
		expectStatus(r, 404);
	});
}

console.log("\n--- misc ---");

await test("unknown route -> 404 JSON { error: not_found }", async () =>
{
	const r = await call(DIRECT, "GET", "/this-route-does-not-exist");
	expectStatus(r, 404);
	expect(r.json?.error === "not_found", `error field is ${r.json?.error}`);
});


// ---------- 3. THROUGH NGINX (what the internet can reach) ----------

console.log("\n--- through nginx ---");

await test("nginx blocks /health (internal route) -> 404", async () =>
{
	expectStatus(await call(NGINX, "GET", "/health"), 404);
});

await test("nginx blocks POST /game-end-stats even with a valid token -> 404", async () =>
{
	const r = await call(NGINX, "POST", "/game-end-stats", { token: TOKEN, body: endPayload(randomUUID(), randomUUID()) });
	expectStatus(r, 404);
});

await test("nginx blocks POST /achievement-unlocked even with a valid token -> 404", async () =>
{
	const r = await call(NGINX, "POST", "/achievement-unlocked", { token: TOKEN, body: { playerUuid: randomUUID(), achievementId: "first_win" } });
	expectStatus(r, 404);
});

await test("nginx lets /own-player-game-data through (no cookie -> 401 from game-stats)", async () =>
{
	expectStatus(await call(NGINX, "GET", "/own-player-game-data"), 401);
});

if (COOKIE && me)
{
	await test("nginx + cookie: /own-player-game-data -> 200", async () =>
	{
		expectStatus(await call(NGINX, "GET", "/own-player-game-data", { cookie: COOKIE }), 200);
	});
}
else
	skip("nginx + cookie", "no valid COOKIE");


// ---------- summary ----------

console.log(`\n${passed} passed, ${failed} failed, ${skipped} skipped`);
process.exit(failed > 0 ? 1 : 0);
