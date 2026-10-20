import { Request, Response } from "express";
import { GameStatsRepository } from "../../repositories/interfaces/GameStatsRepository";
import { AchievementUnlockedRequestSchema } from "@big2/game-stats-types";
import z from "zod";

export function postAchievementUnlocked(repository: GameStatsRepository)
{
	return async (req: Request, res: Response) =>
	{
		const parsed = AchievementUnlockedRequestSchema.safeParse(req.body);
		if (!parsed.success)
		{
			console.error(z.prettifyError(parsed.error));
			return (res.status(400).json({
				error: "invalid_request_body",
				message: z.prettifyError(parsed.error),
			}));
		}

		const ok = await repository.grantAchievement(parsed.data);
		if (!ok)
		{
			console.error("Invalid playerUuid");
			return (res.status(404).json({ 
				error: "invalid_player_uuid",
				message: "Invalid playerUuid"
			}));
		}
		return (res.status(204).end());
	};
}