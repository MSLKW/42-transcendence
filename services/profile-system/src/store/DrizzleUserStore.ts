import { type UserData, type UserSettings, NULL_ACHIEVEMENTS } from "@big2/profile-system-types";
import { userData, userSettings, userProfile } from "@big2/profile-system-schema";
import { eq, ilike, and, isNotNull } from "drizzle-orm";
import { postgres } from "./postgres";
import { UserStore } from "./UserStore";
import { AUTH_SERVICE_URL, 
		 GAME_STATS_SERVICE_URL, 
		 PARTY_MANAGER_SERVICE_URL } from "../config";


// import fs from "fs";
// import path from "path";
// const DATA_DIR = "./data/users";
// if (!fs.existsSync(DATA_DIR))
// 	fs.mkdirSync(DATA_DIR, { recursive: true });


export class DrizzleUserStore implements UserStore
{
	async getUserData(uuid: string): Promise<UserData | null>
	{
		try 
		{
			// 1. one query, within our own schema, via the view => named to (profile)
			const [profile] = await postgres	// [user] optimizes the TypeScript / Application Layer - Drizzle's .select() method always returns an array of objects, regardless of how many rows come back., just extracts item [0] out of the array once Node.js receives the payload
				.select()
				.from(userProfile)
				.where(eq(userProfile.id, uuid))
				.limit(1);						// limit(1) optimizes the Database / Network Layer - explicitly telling PostgreSQL: "The exact millisecond you find 1 row, stop searching immediately and send it over the wire."
			if (!profile) 
				return null;

			// 2. REST calls to the services that own the rest, in parallel => named to authData, gameStatsData, partyData
			if (!AUTH_SERVICE_URL)
				throw new Error("[Error] AUTH_SERVICE_URL not set");

			// commented as game-stats is not yet built, as for now. 
			// handled below by the temporary ternary instead
			// if (!GAME_STATS_SERVICE_URL)
			// 	throw new Error("[Error] GAME_STATS_SERVICE_URL is not set");

			if (!PARTY_MANAGER_SERVICE_URL)
				throw new Error("[Error] PARTY_MANAGER_SERVICE_URL is not set");
			
			// commented as game-stats is not yet built, as for now. 
			// handled below by the temporary ternary instead
			// const [authData, gameStatsData, partyData] = await Promise.all([
			// 	this.fetchJson(`${AUTH_SERVICE_URL}/internal/profile/${uuid}`),
			// 	this.fetchJson(`${GAME_STATS_SERVICE_URL}/internal/profile/${uuid}`),
			// 	this.fetchJson(`${PARTY_MANAGER_SERVICE_URL}/internal/profile/${uuid}`),
			// ]);

			const DEFAULT_GAME_STATS_DATA = {
				level: 0,
				xp: 0,
				totalPlayed: 0,
				totalWins: 0,
				totalLoss: 0,
				winStreak: 0,
			};

			const [authData, gameStatsData, partyData] = await Promise.all([
				this.fetchJson(`${AUTH_SERVICE_URL}/internal/profile/${uuid}`),
				GAME_STATS_SERVICE_URL
					? this.fetchJson(`${GAME_STATS_SERVICE_URL}/internal/profile/${uuid}`).catch(() => DEFAULT_GAME_STATS_DATA)
					: Promise.resolve(DEFAULT_GAME_STATS_DATA),
				this.fetchJson(`${PARTY_MANAGER_SERVICE_URL}/internal/profile/${uuid}`),
			]);
			
			// 3. the view is flat — UserSettings needs to be nested to match UserData
			return {
				uuid: profile.id,
				username: profile.username,
				avatarPath: profile.avatarPath,
				createdAt: authData.createdAt,
				lastLogin: authData.lastLogin,
				level: gameStatsData.level,
				xp: gameStatsData.xp,
				totalPlayed: gameStatsData.totalPlayed,
				totalWins: gameStatsData.totalWins,
				totalLoss: gameStatsData.totalLoss,
				winStreak: gameStatsData.winStreak,
				online: partyData.online,
				inGame: partyData.inGame,
				badge: profile.badge, // puth these 2 at the bottom to prepare of possibility to create Achievements service soon
				achievements: profile.achievements,
			};
		} 
		catch (err: any) 
		{
			console.error("Database query failed in getUserData", err);
			throw (err);
		}
		// try
		// {
		// 	const raw = JSON.parse(await fs.promises.readFile(this.getFilePath(uuid), "utf-8")) as UserData;
		// 	const userData: UserData = {
		// 		uuid:			raw.uuid,
		// 		username:		raw.username,
		// 		avatarPath:		raw.avatarPath,
		// 		badge:			raw.badge,
		// 		level:			raw.level,
		// 		xp:				raw.xp,
		// 		createdAt:		raw.createdAt,
		// 		lastLogin:		raw.lastLogin,
		// 		totalPlayed:	raw.totalPlayed,
		// 		totalWins:		raw.totalWins,
		// 		totalLoss:		raw.totalLoss,
		// 		winStreak:		raw.winStreak,
		// 		achievements:	raw.achievements,
		// 		online:			raw.online,
		// 		inGame:			raw.inGame
		// 	};
		// 	return (userData);
		// }
		// catch (err: any)
		// {
		// 	if (err.code === "ENOENT")
		// 		return (null);
		// 	throw (err);
		// }
	}

	async getUserSettings(uuid: string): Promise<UserSettings | null>
	{
		try
		{
			const [profile] = await postgres
				.select()
				.from(userProfile)
				.where(eq(userProfile.id, uuid))
				.limit(1);
			if (!profile)
				return (null);

			// const DEFAULT_USER_SETTINGS = {
			// 	allow3OfAKind: false,
			// 	allow2OfSpadesEnd: false,
			// 	autoPassIndex: 0,
			// 	endGameCondition: 0,
			// 	scoreCalculation: 0,
			// 	cardStyle: 0,
			// 	uiColor: 0,
			// 	fxLevel: 0,
			// 	mxLevel: 0
			// };

			const [settings] = await postgres
				.select()
				.from(userSettings)
				.where(eq(userSettings.id, uuid))
				.limit(1);
			// if (!settings)
			// 	return (DEFAULT_USER_SETTINGS);

			return {
				allow3OfAKind: 		settings.allow3OfAKind,
				allow2OfSpadesEnd: 	settings.allow2OfSpadesEnd,
				autoPassIndex: 		settings.autoPassIndex,
				endGameCondition: 	settings.endGameCondition,
				scoreCalculation: 	settings.scoreCalculation,
				cardStyle: 			settings.cardStyle,
				uiColor: 			settings.uiColor,
				fxLevel: 			settings.fxLevel,
				mxLevel: 			settings.mxLevel,
			};
		}
		catch (err: any) 
		{
			console.error("Database query failed in getUserSettings", err);
			throw (err);
		}
		// try
		// {
		// 	const raw = JSON.parse(await fs.promises.readFile(this.getFilePath(uuid), "utf-8")) as UserSettings;
		// 	const userSettings: UserSettings = {
		// 		allow3OfAKind:		raw.allow3OfAKind,
		// 		allow2OfSpadesEnd:	raw.allow2OfSpadesEnd,
		// 		autoPassIndex:		raw.autoPassIndex,
		// 		endGameCondition:	raw.endGameCondition,
		// 		scoreCalculation:	raw.scoreCalculation,
		// 		cardStyle:			raw.cardStyle,
		// 		uiColor:			raw.uiColor,
		// 		fxLevel:			raw.fxLevel,
		// 		mxLevel:			raw.mxLevel
		// 	};
		// 	return (userSettings);
		// }
		// catch (err: any)
		// {
		// 	if (err.code === "ENOENT")
		// 		return (null);
		// 	throw (err);
		// }
	}

	async getUuidsByQuery(query: string): Promise<string[]>
	{
		try 
		{
			const results = await postgres
				.select({ uuid: userData.id })
				.from(userData)
				.where(
					and(
						ilike(userData.username, `%${query}%`),
						isNotNull(userData.username)
					));

			return results.map((r: { uuid: string }) => r.uuid); 
			// r is short variable naming that i used in the function .map() for the return value of row objects
			// Map the array of objects [{ uuid: '...' }] into an array of strings ['...']
		}
		catch (err: any) 
		{
			console.error("Database query failed in getUuidsByQuery", err);
			throw (err);
		}
		// const files = await fs.promises.readdir(DATA_DIR);
		// const jsonFiles = files.filter(f => f.endsWith(".json"));

		// const matches = await Promise.all(
		// 	jsonFiles.map(async (file) => {
		// 		const uuid = path.basename(file, ".json");
		// 		const data = await this.getUserData(uuid);
		// 		return (data?.username?.toLowerCase().includes(query.toLowerCase()) ? uuid : null);
		// 	})
		// );
		// return (matches.filter((uuid): uuid is string => uuid !== null));
	}

	async updateUserProfile(uuid: string, partial: Partial<UserData>): Promise<void> // need understand
	{
		try 
		{
			// partial = what the caller gave as parameter. Untouched.
			// dbPartial = a new, smaller object built from partial, keeping only the fields userData table has columns for.
			// _drop — not a type, not special syntax. It's destructuring-rename: { uuid: _drop } means "take the uuid key out of partial, but call it _drop locally." 
			// 		You have to give it some name — you just can't call it uuid, because your function parameter is already named uuid, and reusing it would silently shadow (hide) that parameter inside this block. 
			// 		_drop is a name signaling "grabbed on purpose, never used."
			// The whole line is one filter, read left to right: "pull uuid, createdAt, lastLogin, level... out of partial by name (into variables I'll ignore) — whatever's left over, collect into dbPartial."
			const { uuid: _drop, 
					createdAt, 
					lastLogin, 
					level, 
					xp, 
					totalPlayed, 
					totalWins, 
					totalLoss, 
					winStreak, 
					online, 
					inGame, 
					...dbPartial } = partial;

			await postgres
				.insert(userData)
				.values({ id: uuid, ...dbPartial })
				.onConflictDoUpdate({
					target: userData.id,
					set: dbPartial,
				});
		}
		catch (err: any) 
		{
			if (err.code === "23503") // postgres ForeignKey violation
				throw new Error(`updateUserProfile attempting to query for non-existing uuid: ${uuid}`);
			throw err;
		}
		// let existing = await this.getUserData(uuid);
		// if (!existing)
		// 	await this.createUser(uuid);
		// existing = await this.getUserData(uuid);
		// await this.setData(uuid, { ...existing!, ...partial }, (await this.getUserSettings(uuid))!);
	}

	async updateUserSettings(uuid: string, partial: Partial<UserSettings>): Promise<void>
	{
		try
		{
			// userSettings.id FK -> userData.id
			// so make sure a userData row exists first (no-op update if it already does)
			await postgres
				.insert(userData)
				.values({ id: uuid})
				.onConflictDoNothing({
					target: userData.id
				});

			await postgres
				.insert(userSettings)
				.values({ id: uuid, ...partial })
				.onConflictDoUpdate({
					target: userSettings.id,
					set: partial,
				})
		}
		catch (err: any)
		{
			if (err.code === "23503")
				throw new Error(`updateUserSettings attempting to query for non-existing uuid: ${uuid}`);
			throw err;
		}
		// let existing = await this.getUserSettings(uuid);
		// if (!existing)
		// 	await this.createUser(uuid);
		// existing = await this.getUserSettings(uuid);
		// await this.setData(uuid, (await this.getUserData(uuid))!, { ...existing!, ...partial });
	}

	// private async fetchJson(url: string) {
	// 	const res = await fetch(url);
	// 	if (!res.ok) 
	// 		throw new Error(`Request to ${url} failed with ${res.status}`);
	// 	return res.json();
	// }

	// timeout, esp when game-stats couldnt return anything yet as it dosent existss yet
	private async fetchJson(url: string, timeoutMs = 5000): Promise<any>
	{
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeoutMs);

		try
		{
			const res = await fetch(url, { signal: controller.signal });

			if (!res.ok)
				throw new Error(`Request to ${url} failed with ${res.status}`);

			return await res.json();
		}
		catch (err: any)
		{
			if (err.name === "AbortError")
				throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`);
			throw err;
		}
		finally
		{
			clearTimeout(timer);
		}
	}

	// // NOT MVP, more to backup
	// private async fetchJson(url: string, retries = 2, timeoutMs = 4000): Promise<any>
	// {
	// 	for (let attempt = 0; attempt <= retries; attempt++)
	// 	{
	// 		const controller = new AbortController();
	// 		const timer = setTimeout(() => controller.abort(), timeoutMs);
 
	// 		try
	// 		{
	// 			const res = await fetch(url, { signal: controller.signal });
	// 			clearTimeout(timer);
 
	// 			if (!res.ok)
	// 				throw new Error(`Request to ${url} failed with ${res.status}`);
 
	// 			return await res.json();
	// 		}
	// 		catch (err: any)
	// 		{
	// 			clearTimeout(timer);
 
	// 			const isLastAttempt = attempt === retries;
	// 			if (isLastAttempt)
	// 				throw err;
 
	// 			// short backoff before retrying: 300ms, then 600ms, etc.
	// 			await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
	// 		}
	// 	}
 
	// 	// unreachable, but keeps TS happy about a return type on every path
	// 	throw new Error(`Request to ${url} failed after ${retries + 1} attempts`);
	// }

	// private async createUser(uuid: string)
	// {
	// 	const userData: UserData = {
	// 		uuid:			uuid,
	// 		username:		null,
	// 		avatarPath:		null,
	// 		badge:			"Beginner's Luck",
	// 		level:			0,
	// 		xp:				0,
	// 		createdAt:		new Date(),
	// 		lastLogin:		new Date(),
	// 		totalPlayed:	0,
	// 		totalWins:		0,
	// 		totalLoss:		0,
	// 		winStreak:		0,
	// 		achievements:	structuredClone(NULL_ACHIEVEMENTS),
	// 		online:			false,
	// 		inGame:			false
	// 	};
		
	// 	const userSettings: UserSettings = {
	// 		allow3OfAKind:		true,
	// 		allow2OfSpadesEnd:	true,
	// 		autoPassIndex:		0,
	// 		endGameCondition:	0,
	// 		scoreCalculation:	0,
	// 		cardStyle:			0,
	// 		uiColor:			0,
	// 		fxLevel:			0,
	// 		mxLevel:			0
	// 		};

	// 	await this.setData(uuid, userData, userSettings);
	// }

	// private async setData(uuid: string, userData: UserData, userSettings: UserSettings): Promise<void>
	// {
	// 	const union: UserData | UserSettings = {...userData, ...userSettings};

	// 	await fs.promises.writeFile(
	// 		this.getFilePath(uuid),
	// 		JSON.stringify(union),
	// 		"utf-8"
	// 	);
	// }
	
	// private getFilePath(uuid: string): string
	// {
	// 	return path.join(DATA_DIR, `${uuid}.json`);
	// }
}