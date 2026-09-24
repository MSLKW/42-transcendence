import { eq } from "drizzle-orm";
import { postgresClient } from "./postgresClient";
import { playerStatus } from "@big2/party-schema";

export class DrizzlePlayerStatusStore {

	async setPlayerOnline(uuid: string): Promise<void>
	{
		try
		{
			await postgresClient
				.insert(playerStatus)
				.values({ id: uuid, isOnline: true})
				.onConflictDoUpdate({
					target: playerStatus.id,
					set: { isOnline: true}
				})
				.returning();
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
			await postgresClient
				.update(playerStatus)
				.set({ isOnline: false})
				.where(eq(playerStatus.id, uuid));
		}
		catch (postgresErr)
		{
			console.error(`Failed to mark user <${uuid}> online in database:`, postgresErr);
		}
	}
}