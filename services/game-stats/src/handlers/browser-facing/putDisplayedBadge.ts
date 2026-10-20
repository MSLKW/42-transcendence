import { Request, Response } from "express";
import { GameStatsRepository } from "../../repositories/interfaces/GameStatsRepository";
import { getPlayerUuid } from "../../middleware/requireUser";
import { DisplayedBadgeRequestSchema } from "@big2/game-stats-types";
import z from "zod";


export function putDisplayedBadge(repository: GameStatsRepository)
{
	return async(req: Request, res: Response) =>
	{
		const playerUuid = getPlayerUuid(res);
		const parsed = DisplayedBadgeRequestSchema.safeParse(req.body);
		if (!parsed.success)
		{
			console.error(z.prettifyError(parsed.error));
			return (res.status(400).json({ 
				error: "invalid_request_body",
				message: z.prettifyError(parsed.error),
			}));
		}

		const ok = await repository.setDisplayedBadge(playerUuid, parsed.data);
		if (!ok)
		{
			return (res.status(403).json({ 				// 403 Forbidden
				error: "badge_not_unlocked", 
				message: `cannot display chosen badge "${parsed.data.badge}", it's still locked`
			}));
		}
		return (res.status(204).end());
	};
}