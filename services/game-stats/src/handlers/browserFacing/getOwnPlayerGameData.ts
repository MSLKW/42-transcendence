import { Request, Response } from "express";
import { GameStatsRepository } from "../../repositories/GameStatsRepository";
import { getPlayerUuid } from "../../middleware/requireUser";
import { OwnPlayerGameDataResponseSchema } from "@big2/game-stats-types/game-stats";


export function getOwnPlayerGameData(repository: GameStatsRepository)
{
	return async (req: Request, res: Response) =>
	{
		// 1. valid uuid existance
		// the uuid is provided by auth, so the uuid is trusted to exist in database. 
		const playerUuid = getPlayerUuid(res);

		// 2. return value from drizzle query
		// player_stats + levelProgress + all achievements + all public badges
		const playerData = await repository.getOwnPlayerGameData(playerUuid); 

		// 3. valid response shape
		// safety net to ensure its in the right shape, updatedAt is stripped off in drizzle query already
		const cleanPlayerData = OwnPlayerGameDataResponseSchema.parse(playerData); 
		return (res.json( cleanPlayerData ));
	};
}