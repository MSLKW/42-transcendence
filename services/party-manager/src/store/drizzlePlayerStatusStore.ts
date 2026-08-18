import { eq } from "drizzle-orm";
import { postgres } from "./postgres";
import { playerStatus } from "@big2/party-manager-schema";

export class DrizzlePlayerStatusStore {

	async setPlayerOnline(uuid: string): Promise<void>
	{
		try
		{
			await postgres
				.insert(playerStatus)
				.values({ playerId: uuid, isOnline: true})
				.onConflictDoUpdate({ // newly added
					target: playerStatus.playerId,
					set: { isOnline: true}
				})
				.returning(); // newly added
		}
		catch (postgresErr)
		{
			console.error(`Failed to mark user <${uuid}> online in database:`, postgresErr);
		}
	}

	async setPlayerOffline(uuid: string): Promise<void>
	{
		try
		{
			await postgres
				.update(playerStatus)
				.set({ isOnline: false})
				.where(eq(playerStatus.playerId, uuid));
		}
		catch (postgresErr)
		{
			console.error(`Failed to mark user <${uuid}> online in database:`, postgresErr);
		}
	}
}