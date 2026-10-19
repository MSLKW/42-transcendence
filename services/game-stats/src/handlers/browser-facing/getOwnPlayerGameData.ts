import { Request, Response } from "express";
import { GameStatsRepository } from "../../repositories/interfaces/GameStatsRepository";
import { getPlayerUuid } from "../../middleware/requireUser";
import { OwnPlayerGameDataResponseSchema } from "@big2/game-stats-types";

export function getOwnPlayerGameData(repository: GameStatsRepository)
{
	return async (req: Request, res: Response) =>
	{
		const playerUuid = getPlayerUuid(res);

		const playerData = await repository.getOwnPlayerGameData(playerUuid);
		const cleanPlayerData = OwnPlayerGameDataResponseSchema.parse(playerData); // strip off updatedAt
		return (res.json({cleanPlayerData}));
	};
}