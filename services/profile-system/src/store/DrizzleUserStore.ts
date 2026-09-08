import { type UserData, type UserSettings } from "@big2/profile-system-types";
import { userData, userSettings } from "@big2/profile-system-schema";
import { eq, ilike, and, isNotNull } from "drizzle-orm";
import { postgres } from "./postgres";
import { UserStore } from "./UserStore";


export class DrizzleUserStore implements UserStore
{
	async getUserData(uuid: string): Promise<UserData | null>
	{
		try 
		{
			const [user] = await postgres	// [user] optimizes the TypeScript / Application Layer - Drizzle's .select() method always returns an array of objects, regardless of how many rows come back., just extracts item [0] out of the array once Node.js receives the payload
				.select()
				.from(userData)
				.where(eq(userData.id, uuid))
				.limit(1);						// limit(1) optimizes the Database / Network Layer - explicitly telling PostgreSQL: "The exact millisecond you find 1 row, stop searching immediately and send it over the wire."
			if (!user) 
				return null;

			return {
				username: user.username,
				avatarPath: user.avatarPath,
				badge: user.badge, // puth these 2 at the bottom to prepare of possibility to create Game-Stats service soon
			};
		} 
		catch (err: any) 
		{
			console.error("Database query failed in getUserData", err);
			throw (err);
		}
	}

	async getUserSettings(uuid: string): Promise<UserSettings | null>
	{
		try
		{
			// just to check the user's uuid exists
			const [user] = await postgres
				.select()
				.from(userData)
				.where(eq(userData.id, uuid))
				.limit(1);
			if (!user)
				return (null);

			const [settings] = await postgres
				.select()
				.from(userSettings)
				.where(eq(userSettings.id, uuid))
				.limit(1);

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
	}

	async updateUserProfile(uuid: string, partial: Partial<UserData>): Promise<void> // need understand
	{
		try 
		{
			// // partial = what the caller gave as parameter. Untouched.
			// // dbPartial = a new, smaller object built from partial, keeping only the fields userData table has columns for.
			// // _drop — not a type, not special syntax. It's destructuring-rename: { uuid: _drop } means "take the uuid key out of partial, but call it _drop locally." 
			// // 		You have to give it some name — you just can't call it uuid, because your function parameter is already named uuid, and reusing it would silently shadow (hide) that parameter inside this block. 
			// // 		_drop is a name signaling "grabbed on purpose, never used."
			// // The whole line is one filter, read left to right: "pull uuid, createdAt, lastLogin, level... out of partial by name (into variables I'll ignore) — whatever's left over, collect into dbPartial."
			// const { uuid: _drop, 
			// 		createdAt, 
			// 		lastLogin, 
			// 		level, 
			// 		xp, 
			// 		totalPlayed, 
			// 		totalWins, 
			// 		totalLoss, 
			// 		winStreak, 
			// 		online, 
			// 		inGame, 
			// 		...dbPartial } = partial;

			await postgres
				.insert(userData)
				.values({ id: uuid, ...partial })
				.onConflictDoUpdate({
					target: userData.id,
					set: partial,
				});
		}
		catch (err: any) 
		{
			if (err.code === "23503") // postgres ForeignKey violation
				throw new Error(`updateUserProfile attempting to query for non-existing uuid: ${uuid}`);
			throw err;
		}
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
	}

}