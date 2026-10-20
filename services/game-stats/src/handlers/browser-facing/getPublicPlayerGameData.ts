import { Request, Response } from "express";
import { GameStatsRepository } from "../../repositories/interfaces/GameStatsRepository";
import { PublicPlayerGameDataResponseSchema } from "@big2/game-stats-types";
import z from "zod";

export function getPublicPlayerGameData(repository: GameStatsRepository)
{
	return async (req: Request, res: Response) =>
	{
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

		const playerData = await repository.getPublicPlayerGameData(playerUuid)
		if (!playerData)
			return (res.status(404).end());

		const cleanPlayerData = PublicPlayerGameDataResponseSchema.parse(playerData);
		return (res.json(cleanPlayerData));
	};
}