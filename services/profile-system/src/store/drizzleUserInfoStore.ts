import { postgres } from "postgres";
import { users } from "@big2/auth-schema";
import { userInfo, userSettings } from "@big2/profile-system-schema";
import { eq, ilike } from "drizzle-orm";

export class DrizzleUserInfoStore {

	//TODO: put username into Postgres =>setUsername()
	async setUsername(id: string, username: string): Promise<void> {
    	await postgres.update(userInfo).set({ username }).where(eq(userInfo.id, id));
	}

	//TODO: fill in searchResults from Postgres
	async searchUsersByUsername(searchTerm: string): Promise<string[]> {
		const results = await postgres
			.select({ username: userInfo.username })
			.from(userInfo)
			.where(ilike(userInfo.username, `%${searchTerm}%`)); // i = case-insensitive, like = LIKE in SQL (for wildcards)
			// .limit(20); // cap it — an unbounded search can accidentally hand back your whole user table - sure no harm on that. 
			
		return results
			.map((r: { username: string | null }) => r.username)
			.filter((u: string | null): u is string => u !== null); // users with no username yet shouldn't show up in search
  }
}