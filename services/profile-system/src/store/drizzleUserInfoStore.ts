import { postgres } from "./postgres";
import { userData } from "@big2/profile-system-schema";
import { eq, ilike } from "drizzle-orm";

export class DrizzleUserDataStore {

	//TODO: put username into Postgres =>setUsername()
	async setUsername(id: string, username: string): Promise<void> {
    	await postgres
			.update(userData)
			.set({ username })
			.where(eq(userData.id, id));
	}

	//TODO: fill in searchResults from Postgres
	async searchUsersByUsername(searchTerm: string): Promise<string[]> {
		const results = await postgres // intentionally want result to be in an array, thus not [results] which just take the object at index 0 only
			.select({ username: userData.username })
			.from(userData)
			.where(ilike(userData.username, `%${searchTerm}%`)); // i = case-insensitive, like = LIKE in SQL (for wildcards)
			// .limit(20); // cap it — an unbounded search can accidentally hand back your whole user table - sure, no harm on that. 
			
		return results
			.map((r: { username: string | null }) => r.username)
			.filter((u: string | null): u is string => u !== null); // users with no username yet shouldn't show up in search
  }
}