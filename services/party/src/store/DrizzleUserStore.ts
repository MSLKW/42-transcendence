import { eq } from "drizzle-orm";
import { UserStore, UserData } from "./UserStore";
import { postgresClient } from "./postgresClient";
import { playerStatus } from "@big2/party-schema";

export class DrizzleUserStore implements UserStore {

	async setUser(user: UserData): Promise<void>
	{
		await postgresClient
			.insert(playerStatus)
			.values({ id: user.uuid, lastOnline: user.lastOnline })
			.onConflictDoUpdate // inserts a new row, or updates lastOnline if the UUID already exists.
			({
				target: playerStatus.id,
				set: { lastOnline: user.lastOnline }, // set in index.ts's finalizeRemoval
			});
	}

	async getUser(uuid: string): Promise<UserData | null>
	{
		const [user] = await postgresClient
			.select()
			.from(playerStatus)
			.where(eq(playerStatus.id, uuid))
			.limit(1);
		
		if (!user)
			return null;

		return { 
			uuid: user.id, 
			lastOnline: user.lastOnline 
		};
	}
}