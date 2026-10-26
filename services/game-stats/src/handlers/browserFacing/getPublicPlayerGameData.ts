import { Request, Response } from "express";
import { GameStatsRepository } from "../../repositories/GameStatsRepository";
import { PublicPlayerGameDataResponseSchema } from "@big2/game-stats-types/game-stats";
import z from "zod";
import { isForeignKeyViolation } from "@big2/postgres-client";

export function getPublicPlayerGameData(repository: GameStatsRepository)
{
	return async (req: Request, res: Response) =>
	{
		// 1. valid uuid shape of 8-4-4-8 only, not uuid existance
		// the only handler of all browserFacing routes to recieve uuid from URL, not directly from auth service
		const parsed = z.uuid().safeParse(req.params.playerUuid);
		if (!parsed.success)
		{
			console.error(z.prettifyError(parsed.error));
			return (res.status(400).json({
				error: "invalid_player_uuid",
				message: z.prettifyError(parsed.error),
			}));
		}
		const playerUuid = parsed.data;

		try
		{
			// 2. return value from drizzle query & checked uuid existance
			// player_stats + levelProgress + all achievements (without all public badges)
			const playerData = await repository.getPublicPlayerGameData(playerUuid) 
			
			// 3. valid response shape
			// safety net to ensure its in the right shape, updatedAt is stripped off in drizzle query already
			const cleanPlayerData = PublicPlayerGameDataResponseSchema.parse(playerData); 
			return (res.json( cleanPlayerData ));
		}
		catch (error: unknown)
		{
			// non-existing uuid - thrown postgres error foreign_key_violation if the playerUuid dosent exists
			// coz the uuid comes from the URL, so anyone (even users via browser) can send random uuids over the URL
			// just 404 coz its normal to have invalid params via URLs
			if (isForeignKeyViolation(error))
				return (res.status(404).json({ error: "invalid_player_uuid", message: "Invalid playerUuid" }));
			
			// other unexpected thrown postgres errors, recieved by central error handler with their own console log
			throw error;
		}
	};
}
