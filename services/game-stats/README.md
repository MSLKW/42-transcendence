# game-stats

The **game-stats** microservice stores everything about a player's progress in the Big 2 game:

- **stats**: level, XP, games played, wins, win streak, displayed badge (the one badge a player chooses to show on their profile)
- **achievements**: things done during a game (for example "won without passing")
- **badges**: collectables, some earned from stats, some from achievements, some from hidden easter eggs
- **processed rounds**: a record of every finished round and the answer that was sent for it, so a retried request is never counted twice (internal managed by game-stats alone only: the website and game-server don't need to do anything for it)


game-stats talks to two other services, and **each one may only use its own routes**:

| Who | Uses | How it authenticates | Section |
|---|---|---|---|
| **website** (browser) | the 4 *browser-facing* routes | the login cookie `session_token` (checked by game-stats through auth) | [For the website](#for-the-website) |
| **game-server** | the 3 *internal* routes | `Authorization: Bearer <STATISTICS_TOKEN>` | [For the game-server](#for-the-game-server) |

```
   browser ──► nginx ──► /api/game-stats/<browser-facing route> ──► game-stats
                         (internal routes are blocked here: 404)        ▲
   game-server ─────────────► http://game-stats:3000/<internal route> ──┘
                                                                        │
   game-stats calls:  auth (cookie check), profile + friends (easter egg checks), postgres
```

> Players are identified everywhere by their **auth user id** (a UUID). The id game-stats stores is the same one auth returns.

---

## Contents

1. [Quick facts](#quick-facts)
2. [For the website](#for-the-website)
3. [For the game-server](#for-the-game-server)
4. [Reference: rules, badges, achievements, levels](#reference-rules-badges-achievements-levels)
5. [Error format](#error-format)
6. [Running and testing](#running-and-testing)
7. [For game-stats maintainers](#for-game-stats-maintainers)
8. [Open questions and TODO](#open-questions-and-todo)

---

## Quick facts

- A player's stats row is **created automatically** the first time anything touches that player (first game, first profile view, and so on). Nobody has to "register" a player in game-stats.
- Sending the **same game round twice is safe**. The second time returns the same answer and nothing is counted twice (see [Retries](#retries-and-idempotency)).
- Bots never get stats. They are silently skipped.
- Spectators are **not players**. Never send them to game-stats.
- All JSON field names are `camelCase`.
- The shared TypeScript types and zod schemas live in `packages/types/game-stats-types` (import from `@big2/game-stats-types/game-stats`). Use them instead of retyping shapes.

---

## For the website

### How to call

The browser only talks to nginx. All game-stats routes sit under one prefix, which is already in the website's env as `VITE_API_GAME_STATS_PATH` (value: `/api/game-stats`).

```ts
const GAME_STATS = import.meta.env.VITE_API_GAME_STATS_PATH; // "/api/game-stats"

// the login cookie is sent automatically (same origin), nothing to add by hand
const res = await fetch(`${GAME_STATS}/own-player-game-data`);
if (res.status === 401) { /* not logged in */ }
const data = OwnPlayerGameDataResponseSchema.parse(await res.json()); // from @big2/game-stats-types/game-stats
```

Only these 4 routes pass through nginx. Anything else under `/api/game-stats/` returns `404`.

| Route | Needs login cookie | Purpose |
|---|---|---|
| `GET  /own-player-game-data` | yes | everything about **me** (stats, level progress, achievements, all my badges) |
| `GET  /public-player-game-data/:playerUuid` | no | what anyone may see about **another player** (no badge list) |
| `PUT  /displayed-badge` | yes | choose which unlocked badge to display |
| `POST /easter-egg-found` | yes | tell game-stats "I think this player found easter egg X", game-stats decides |

---

### `GET /own-player-game-data`

For the profile page of the logged-in player. No body.

**200 response**

```json
{
  "stats": {
    "playerUuid": "3d4d1670-79f1-4d09-ab3c-2bbe139713cc",
    "level": 2,
    "xp": 250,
    "totalPlayed": 4,
    "totalWins": 2,
    "winStreak": 1,
    "displayedBadgeId": "fresh_deal"
  },
  "levelProgress": {
    "currentLevel": 2,
    "currentLevelXpEarned": 40,
    "currentLevelXpThreshold": 121,
    "currentLevelProgressPercentage": 33
  },
  "achievements": {
    "best_single": null,
    "best_double": null,
    "first_win": "2026-10-26T03:44:36.000Z"
    /* ...one entry for every achievement id... */
  },
  "badges": {
    "fresh_deal": true,
    "beginners_luck": true,
    "worthy_opponent": false
    /* ...every public badge, true = unlocked, false = locked... */
  }
}
```

How to read it:

- **`levelProgress`** is ready to display, no maths needed.
  - `currentLevelXpEarned` out of `currentLevelXpThreshold` is the progress bar.
  - `currentLevelProgressPercentage` is a whole number 0 to 100. It has **no `%` sign**, add it yourself if you show text.
  - At the maximum level (100), `currentLevelXpThreshold` is `null` and the percentage is `100`.
  - The first level is `0`.
- **`achievements`**: every achievement id is always present. A string is the time it was unlocked (ISO date), `null` means still locked.
- **`badges`**:
  - Every **public** badge is always present: `true` = unlocked, `false` = locked.
  - **Secret** badges (`curious_cat`, `imposter`, `social_butterfly`, `connoisseur`) are **missing from the object until unlocked**. Do not show an empty slot for a missing secret badge.
- **`stats.displayedBadgeId`** is the badge the player chose to display. It is always one they have unlocked.

**Errors:** `401` (no cookie, or session invalid or expired), `502`, `503` (see [Status codes](#status-codes-the-website-can-get)). Note that these three come back with an **empty body**, not JSON.

---

### `GET /public-player-game-data/:playerUuid`

For viewing **someone else's** profile. No login needed. No body.

`playerUuid` must be a UUID, the player's auth user id.

**200 response**: same as the own-data response **without `badges`**:

```json
{
  "stats": { "playerUuid": "...", "level": 2, "xp": 250, "totalPlayed": 4, "totalWins": 2, "winStreak": 1, "displayedBadgeId": "fresh_deal" },
  "levelProgress": { "currentLevel": 2, "currentLevelXpEarned": 40, "currentLevelXpThreshold": 121, "currentLevelProgressPercentage": 33 },
  "achievements": { "first_win": "2026-10-26T03:44:36.000Z", "best_single": null }
}
```

To show another player's badge, use `stats.displayedBadgeId`. Their full badge list is private by design.

| Status | Body | Meaning |
|---|---|---|
| `400` | `{ "error": "invalid_player_uuid", "message": "..." }` | the id in the URL is not a UUID |
| `404` | `{ "error": "invalid_player_uuid", "message": "Invalid playerUuid" }` | no such player |

---

### `PUT /displayed-badge`

Used when the player picks a badge in the profile popup.

**Request body**

```json
{ "badgeId": "hot_hand" }
```

`badgeId` must be one of the badge ids listed in [Badges](#badges).

| Status | Body | Meaning |
|---|---|---|
| `204` | none | done. Choosing the already-displayed badge also gives `204`. |
| `400` | `{ "error": "invalid_request_body", "message": "..." }` | not a known badge id |
| `403` | `{ "error": "badge_not_unlocked", "message": "..." }` | valid badge, but the player has not unlocked it |
| `401` | empty | not logged in |

Tip: only offer unlocked badges (from `badges` in the own-data response) in the popup, so `403` never happens in normal use.

---

### `POST /easter-egg-found`

Easter eggs are secret badges. **The website only reports "this might be an easter egg", and game-stats is the judge.** For eggs that depend on other services, game-stats checks the real data itself, so a wrong or cheating call just gets `404`.

**Request body**

```json
{ "eggId": "egg_f355a785db3c" }
```

**The 4 eggs** (the ids are intentionally meaningless, do not rename them):

| `eggId` | Badge granted | Player must have... | game-stats checks it? | When the website should call |
|---|---|---|---|---|
| `egg_f355a785db3c` | `curious_cat` | clicked the hidden button inside the Privacy Policy | **no, it trusts the website** | right when the hidden button is clicked |
| `egg_b31524145402` | `imposter` | a username that starts with `bot-` | yes, asks profile | after a username is saved successfully |
| `egg_0a793011efa2` | `social_butterfly` | **42 or more friends** | yes, asks friends | after a friendship is formed (see below) |
| `egg_5640cd1ea99b` | `connoisseur` | picked one specific avatar | yes, asks profile | after an avatar is saved successfully |

> Please keep this table out of anything players can read. The ids are visible in the browser code, but the **rules** are meant to stay secret.

**200 response**

```json
{ "newlyGrantedBadgeIdForEasterEgg": "curious_cat" }
```

- A badge id means "unlocked **just now**". Show your celebration or notification.
- `null` means "already had it". Show nothing.

| Status | Body | Meaning |
|---|---|---|
| `400` | `{ "error": "invalid_request_body", "message": "Invalid request body" }` | body is not `{ eggId: string }` |
| `404` | `{ "error": "not_found" }` | unknown egg id, **or** the player does not qualify. These are deliberately the same answer. **This is normal, do not treat it as an error or show anything.** |
| `503` | `{ "error": "service_unavailable" }` | profile or friends is down. Nothing wrong with the request, just try again on the next trigger. |
| `401` | empty | not logged in |

#### Recommended way to trigger eggs (important)

game-stats only reacts when it is asked. It does **not** watch profile or friends on its own. So the website must ask **after each action that could make an egg true**. This keeps it cheap and works well:

1. **Call after the action succeeded**, not before. For example, after the profile service confirms the new username, then call `imposter`.
2. **Skip the call if the badge is already unlocked.** Secret badges appear in `badges` only when unlocked, so if the key is present, there is nothing to do.
3. **Skip the call if you can already tell it will fail.** For `social_butterfly`, the website already knows the friend list, so only call when the list has **42 or more** friends. This avoids a pointless request on every new friend.
4. **For `social_butterfly`, remember both people in a friendship get the chance.** The call always applies to **the person using that browser**. So:
   - the person who **accepts** a request calls it right after accepting, and
   - the person who **sent** the request calls it when their browser learns the friendship was accepted (for example from the friends events stream), or at the latest next time they open the app.
5. **As a safety net**, you may also call the friend and avatar and username eggs once when the profile page loads, if the badge is still locked. It is harmless: repeated calls cannot give the badge twice.
6. **Never retry in a loop** on `404`. It will not change until the player does something new.

---

### Status codes the website can get

| Status | Body | Meaning | What to do |
|---|---|---|---|
| `200` / `204` | json / none | success | |
| `400` | json with `error` and `message` | the request is wrong | fix the code, not a runtime case |
| `401` | **empty** | not logged in or session expired | send the user to login |
| `403` | json | locked badge chosen | see `PUT /displayed-badge` |
| `404` | json | no such player, or egg not earned | see each route |
| `502` | **empty** | auth answered something unexpected | show a generic error, report it |
| `503` | **empty** (or json for easter eggs) | auth, profile or friends unreachable, or database down | try again later |
| `500` | `{ "error": "internal_error" }` | a bug in game-stats | report it |

---

## For the game-server

### Setup (once)

game-stats is only reachable from game-server **inside the docker network**.

| Setting | Value |
|---|---|
| Base URL | `GAME_STATS_SERVICE_URL` = `http://game-stats:3000` (already in the compose env of game-server) |
| Token | the secret `statistics-token`, available in the container as the file `/run/secrets/statistics-token`, path in env `STATISTICS_TOKEN_FILE` (already set in compose) |
| Header | `Authorization: Bearer <token>` on **every** internal call (except `/health`) |
| Header | `Content-Type: application/json` on every `POST` |

Read the token once at startup, the same way game-stats does it:

```ts
import fs from "fs";

const STATISTICS_TOKEN_FILE = process.env.STATISTICS_TOKEN_FILE!;
export const STATISTICS_TOKEN = fs.readFileSync(STATISTICS_TOKEN_FILE, "utf-8").trim();
```

A missing, wrong or empty token gives `401 { "error": "unauthorized" }`.

The 3 internal routes are **not reachable through nginx**, only directly at `http://game-stats:3000`.

---

### `POST /game-end-stats`

**Call once at the end of every round**, after the winner is known. This updates XP, level, games played, wins and win streak, and grants the badges that come from stats.

#### Request body

The shape is `GameEndStatsTransmit` from `@big2/game-types/validation` (the zod schema is `GameEndStatsTransmitSchema`). Build the payload with that type.

| Field | Type | Meaning |
|---|---|---|
| `uuid` | uuid string | **unique id of this round.** The same round always uses the same id (this is what makes retries safe). A new round must use a new id. |
| `winnerPlayerUuid` | string | the winner's id. **Must also be a key in `playerXpGains`.** Can be a human or a bot. |
| `playerXpGains` | `{ [playerId]: integer ≥ 0 }` | XP earned this round, **one entry per player in the round** (humans and bots) |
| `playerFinalCardAmounts` | `{ [playerId]: integer ≥ 0 }` | required by the schema, **currently not used by game-stats** |
| `playerPenaltyPoints` | `{ [playerId]: integer ≥ 0 }` | required by the schema, **currently not used by game-stats** |
| `temporaryWinStreakAmount` | integer ≥ 0 | required by the schema, **currently not used**: game-stats keeps its own win streak |
| `temporaryRoundsPlayed` | integer ≥ 0 | required by the schema, **currently not used**: game-stats keeps its own count |

**Who goes into the maps?**

| Kind of person | Their id looks like | What to send |
|---|---|---|
| Human **player** | a plain UUID: `7c9e6679-7425-40de-944b-e07fc1f90ae7`. It must be their **auth user id**. | include them in `playerXpGains` (and the other maps) |
| **Bot** player | exactly `bot-` followed by a UUID: `bot-9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d` | include them too. game-stats drops bots on its own. If a bot **wins**, send the bot's id as `winnerPlayerUuid`. Everyone else simply counts as a loss. |
| **Spectator** | | **do not include**. They are not playing, so they get no XP and no game played. |

Notes:

- A round with **only bots** playing (all humans are spectators) is fine. You still get `200`, with an empty `playerAccumulatedStats`.
- A bot id must be **exactly** `bot-<valid uuid>`. Something like `bot-1` is treated as a human and fails with `400`.
- Every human id must exist in auth. If **one** human id is unknown, the **whole** request is rejected with `404` and **no stats are saved for that round**.

**Example request**

```json
{
  "uuid": "123e4567-e89b-42d3-a456-426614174000",
  "winnerPlayerUuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "playerFinalCardAmounts": {
    "7c9e6679-7425-40de-944b-e07fc1f90ae7": 0,
    "f47ac10b-58cc-4372-a567-0e02b2c3d479": 6,
    "bot-9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d": 3
  },
  "playerPenaltyPoints": {
    "7c9e6679-7425-40de-944b-e07fc1f90ae7": 0,
    "f47ac10b-58cc-4372-a567-0e02b2c3d479": 6,
    "bot-9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d": 3
  },
  "playerXpGains": {
    "7c9e6679-7425-40de-944b-e07fc1f90ae7": 50,
    "f47ac10b-58cc-4372-a567-0e02b2c3d479": 20,
    "bot-9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d": 10
  },
  "temporaryWinStreakAmount": 1,
  "temporaryRoundsPlayed": 1
}
```

#### Response `200`

Only **humans** appear in `playerAccumulatedStats`, keyed by their id.

```json
{
  "roundId": "123e4567-e89b-42d3-a456-426614174000",
  "playerAccumulatedStats": {
    "7c9e6679-7425-40de-944b-e07fc1f90ae7": {
      "stats": {
        "playerUuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "level": 1,
        "xp": 150,
        "totalPlayed": 3,
        "totalWins": 1,
        "winStreak": 1,
        "displayedBadgeId": "fresh_deal"
      },
      "levelProgress": {
        "currentLevel": 1,
        "currentLevelXpEarned": 50,
        "currentLevelXpThreshold": 110,
        "currentLevelProgressPercentage": 45
      },
      "previousLevel": 0,
      "isLeveledUp": true,
      "newlyGrantedBadgeIdsForStats": ["beginners_luck"]
    }
  }
}
```

What game-server can do with it (it is for showing the **result screen**, you do not need to store anything):

- `isLeveledUp` is `true` when the player reached a new level this round (`previousLevel` is the level before).
- `newlyGrantedBadgeIdsForStats` lists badges **unlocked by this round** (levels, wins, games played, win streak). Show a notification for each one. An empty list means nothing new.
- `levelProgress` is ready for a progress bar (same fields as the website's).

#### Errors

| Status | Body | Meaning | Retry? |
|---|---|---|---|
| `400` | `{ "error": "invalid_request_body", "message": "..." }` | body does not match the schema (the message says which field) | no, fix the payload |
| `400` | `{ "error": "winner_is_not_among_players" }` | `winnerPlayerUuid` is not a key of `playerXpGains` | no, fix the payload |
| `400` | `{ "error": "invalid_uuid_for_humans_players_and_or_game_round", "message": "..." }` | a non-bot id is not a valid UUID, or `uuid` of the round is not a UUID | no, fix the payload |
| `401` | `{ "error": "unauthorized" }` | missing or wrong token | no, fix the config |
| `404` | `{ "error": "invalid_player_uuid", "message": "..." }` | a human id does not exist in auth. **Nothing was saved.** | no |
| `503` | `{ "error": "database_unavailable" }` + header `Retry-After: 2` | database is down | **yes**, same body |
| `500` | `{ "error": "internal_error" }` | bug in game-stats | yes, a few times, then report it |

#### Retries and idempotency

Network calls fail sometimes, so the rule is simple: **if you did not get a clear answer, send the exact same request again, with the same round `uuid`.**

- First time: the round is counted and the answer is saved.
- Any later time with the same `uuid`: game-stats returns **the same saved answer** (same `newlyGrantedBadgeIdsForStats` too) and counts **nothing** again.

So it is safe to retry on timeouts, network errors, `503` and `500`. Use a timeout (suggested 5 seconds).

**Example call**

```ts
const res = await fetch(`${GAME_STATS_SERVICE_URL}/game-end-stats`, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"Authorization": `Bearer ${STATISTICS_TOKEN}`,
	},
	body: JSON.stringify(payload),          // typed as GameEndStatsTransmit
	signal: AbortSignal.timeout(5000),
});

if (res.ok) {
	const result = await res.json();        // GameEndStatsResponse from @big2/game-stats-types/game-stats
	// show level-ups and new badges
}
else if (res.status === 503 || res.status >= 500) {
	// retry with the SAME payload (same payload.uuid)
}
else {
	console.error("game-stats rejected the round:", res.status, await res.text()); // 4xx: fix the payload
}
```

---

### `POST /achievement-unlocked`

**Call when a player earns an achievement during a game.** game-stats does not decide who earns what: **game-server owns the rules** and game-stats only records them and tells you if it was new.

#### Request body

```json
{
  "playerUuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "achievementId": "best_straight_flush"
}
```

- `playerUuid`: a **human** player's auth id. **Never send a bot id here**, it fails with `400`.
- `achievementId`: one of the ids in [Achievements](#achievements).

#### Response `200`

```json
{
  "playerUuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "achievementId": "best_straight_flush",
  "isNewlyGrantedAchievement": true,
  "newlyGrantedBadgeIdForAchievement": "flush_with_pride"
}
```

- `isNewlyGrantedAchievement`: `true` = first time ever, **show the notification**. `false` = the player already had it, show nothing.
- `newlyGrantedBadgeIdForAchievement`: a badge id if this achievement also unlocked a badge **just now**, otherwise `null`. Only two achievements give a badge (see [Achievements](#achievements)).

It is **safe to call as often as you like** for the same player and achievement. A repeat just answers `isNewlyGrantedAchievement: false`. Calling it again with the same data never gives anything twice.

#### Errors

| Status | Body | Meaning |
|---|---|---|
| `400` | `{ "error": "invalid_request_body", "message": "..." }` | wrong body, unknown achievement id, or the id is not a UUID (for example a bot id) |
| `401` | `{ "error": "unauthorized" }` | missing or wrong token |
| `404` | `{ "error": "invalid_player_uuid", "message": "Invalid playerUuid" }` | no such player in auth |
| `503` | `{ "error": "database_unavailable" }` | try again |

---

### `GET /health`

No token needed. Returns `200 { "status": "healthy", "message": "..." }` when the service is up. Handy for checks and for confirming your network setup.

---

## Reference: rules, badges, achievements, levels

### Badges

Public badges (always listed, `true` or `false`):

| Badge id | How it is earned | Granted by |
|---|---|---|
| `fresh_deal` | default displayed badge upon sign up | game-stats, automatically |
| `beginners_luck` | reach level 1 | `/game-end-stats` |
| `worthy_opponent` | reach level 5 | `/game-end-stats` |
| `enthusiast` | reach level 10 | `/game-end-stats` |
| `risk_taker` | reach level 20 | `/game-end-stats` |
| `the_strategist` | reach level 50 | `/game-end-stats` |
| `big_2_champion` | reach level 100 | `/game-end-stats` |
| `double_digits` | win 10 games | `/game-end-stats` |
| `century_club` | play 100 games | `/game-end-stats` |
| `hot_hand` | win streak of 5 | `/game-end-stats` |
| `flush_with_pride` | play a straight flush (achievement `best_straight_flush`) | `/achievement-unlocked` |
| `never_folds` | win without passing (achievement `win_no_pass`) | `/achievement-unlocked` |

Secret badges (missing from the list until unlocked, granted only by `/easter-egg-found`, details in [the easter egg table](#post-easter-egg-found)):

`curious_cat`, `imposter`, `social_butterfly`, `connoisseur`

### Achievements

All 12 ids, always present in the own and public data (`null` = locked). Send these ids to `/achievement-unlocked`.

| Achievement id | Suggested display name | Also grants a badge |
|---|---|---|
| `best_single` | High | |
| `best_double` | Double | |
| `best_triple` | Triple | |
| `best_straight` | Straight | |
| `best_flush` | Flush | |
| `best_full_house` | Full House | |
| `best_four_of_a_kind` | 4 Of A Kind | |
| `best_straight_flush` | Straight Flush | `flush_with_pride` |
| `play_three_diamonds` | 3 Of Diamonds | |
| `play_two_spades` | 2 Of Spades | |
| `win_no_pass` | No Pass | `never_folds` |
| `first_win` | First Win | |

### Levels and XP

- Levels start at **0** and stop at **100** (`MAX_LEVEL`).
- Going from level 0 to level 1 costs **100 XP**. Each next level costs **10 % more** than the one before it (rounded to a whole number): the XP needed to go from level *L-1* to level *L* is `round(100 × 1.1^(L-1))`.
- XP keeps adding up after level 100. The level just stays at 100.
- The numbers live in `src/rules/levels.rules.ts`. If they change, the website and game-server need no code change, because game-stats sends ready-made `levelProgress`.

---

## Error format

Errors are JSON in this shape, except where noted as **empty body**:

```json
{ "error": "machine_readable_code", "message": "optional human readable detail" }
```

- Use `error` in code (it is stable). Do not parse `message`.
- Unknown route: `404 { "error": "not_found" }`.
- Broken JSON body: `400 { "error": "invalid_request_body" }`. Body too big: the same answer.
- The login check (`requireUser`) replies with **empty bodies** for `401`, `502` and `503`.

---

## Running and testing

### Run

```
docker compose up --build            # whole project
docker compose up -d --build game-stats   # only game-stats
docker compose logs game-stats --tail 30
```

### Temporary test port

For testing, game-stats is also published on your own machine only:

```yaml
    ports:
      - "127.0.0.1:3002:3000"
```

This line is **for testing only**. It will be removed (or moved to a dev compose file) once the integration is verified in the browser and the database. Nothing in the real flow depends on it.

### Tester script

`services/game-stats/test/tester.mjs` calls every route and prints PASS or FAIL (31 checks). Needs Node 18 or newer, nothing to install.

1. Log in on `http://localhost:8080` with a **throwaway account**.
2. Open the browser DevTools, Network tab, click any `/api/...` request, and copy the cookie from the request headers. It looks like `session_token=...`.
3. From the **repo root**:

```
COOKIE='session_token=PASTE_VALUE_HERE' node services/game-stats/test/tester.mjs
```

Without `COOKIE`, only the internal and nginx checks run and the rest show as SKIP.

> The tester **writes data**: it adds XP, one game played and the `first_win` achievement to the account of the cookie. `make fclean` resets the database.

Optional env vars: `DIRECT_URL` (default `http://127.0.0.1:3002`), `NGINX_URL` (default `http://localhost:8080/api/game-stats`), `STATISTICS_TOKEN` (default: read from `secrets/tokens/statistics-token.txt`), `PLAYER_UUID`.

---

## For game-stats maintainers

**Code layout** (`services/game-stats/src`)

| Folder | What is in it |
|---|---|
| `routes/` | `browserFacing.routes.ts` and `internal.routes.ts` list every route |
| `handlers/browserFacing/`, `handlers/internal/` | one file per route |
| `middleware/` | `requireUser` (cookie check via auth) and `requireStatisticsToken` (bearer token check) |
| `repositories/` | all database work (`DrizzleGameStatsRepository`) |
| `rules/` | levels, stats badges, achievement badges, easter eggs (+ `verifiers/`) |
| `config/env.ts` | required environment variables |

**Environment variables:** `PORT`, `AUTH_SERVICE_URL`, `PROFILE_SERVICE_URL`, `FRIENDS_SERVICE_URL`, `STATISTICS_TOKEN_FILE`, plus the usual `PG*` variables and `PG_POOL_MAX`.

**What game-stats needs from other services** (if one of these changes, game-stats breaks):

| Service | Call | Expected answer |
|---|---|---|
| auth | `GET /validate` with the cookie | `200 { "userId": "<uuid>" }` |
| profile | `GET /profile/:uuid` | `200 { "username": string \| null, "avatarPath": string \| null }`, or `404` when the player has no profile yet |
| friends | `GET /friendships/:uuid` | `200` with an array of friend UUIDs |

**How a round is saved:** players are locked in a fixed order, the round id is stored first (so a repeat is detected), all stat changes happen in **one database transaction**, and the answer is saved with the round so a retry gets the identical response.

**Nginx:** only the 4 browser-facing routes are allowed through. Any new browser-facing route must also be added to the allowlist in `infra/nginx` (the `map $uri $game_stats_allowlist` block).

---

## Open questions and TODO

| Item | Status |
|---|---|
| **XP limit per round.** game-stats accepts any non-negative integer as XP from game-server and does not cap it. (This is separate from the XP needed per level, which is in `levels.rules.ts`.) | Needs agreement between game-stats and game-server on a sensible maximum. If agreed, add `.max(...)` in `src/types/GameEndStatsInput.ts`. |
| **Avatar for the `connoisseur` badge.** Currently the file name `avatar-animal-3.webp` in `rules/easterEgg/verifiers/verifyProfile.ts` (`SPECIAL_AVATAR_PATH`). | Placeholder until decided. If it changes, update it there and tell the website team. |
| **CORS.** The service currently allows any origin. Behind nginx the browser uses the same origin so it does not matter, but it should be restricted before production. | TODO in `src/index.ts` |
| **Test port `127.0.0.1:3002`** | Temporary, remove after full integration is verified. |
| **Display names and hints** for badges and achievements | TODO for the website. Suggested texts are in `packages/types/game-stats-types` (commented). |
| **Round shutdown polish** (waiting for open requests before exit) | Optional |