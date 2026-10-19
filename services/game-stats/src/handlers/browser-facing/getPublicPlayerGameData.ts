import { Request, Response } from "express";
import { getPlayerUuid } from "../../middleware/requireUser";
import { GameStatsRepository } from "../../repositories/interfaces/GameStatsRepository";
import { PublicPlayerGameDataResponseSchema } from "@big2/game-stats-types";

export function getPublicPlayerGameData(repository: GameStatsRepository)
{
	return async (req: Request, res: Response) =>
	{
		const playerUuid = getPlayerUuid(res);
		
		const playerData = await repository.getPublicPlayerGameData(playerUuid)
		const cleanPlayerData = PublicPlayerGameDataResponseSchema.parse(playerData);
		return (res.json({cleanPlayerData}));
	};
}