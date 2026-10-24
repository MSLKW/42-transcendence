import { Request, Response } from "express";
import { GameStatsRepository } from "../../repositories/GameStatsRepository";
import { getPlayerUuid } from "../../middleware/requireUser";
import { DisplayedBadgeRequestSchema } from "@big2/game-stats-types";
import z from "zod";


export function putDisplayedBadge(repository: GameStatsRepository)
{
	return async(req: Request, res: Response) =>
	{
		// 1. valid uuid existance
		// the uuid is provided by auth, so the uuid is trusted to exist in database. 
		const playerUuid = getPlayerUuid(res);

		// 2. correct request shape
		// block invalid badges that isnt from the types.
		const parsed = DisplayedBadgeRequestSchema.safeParse(req.body);
		if (!parsed.success)
		{
			console.error(z.prettifyError(parsed.error));
			return (res.status(400).json({ 
				error: "invalid_request_body",
				message: z.prettifyError(parsed.error),
			}));
		}

		// 3. return drizzle query's value & http response
		// return boolean:
		// false	= 403 Forbidden, they chose valid badge but its still locked
		// true		= 204, they chose valid badge & unlocked badge
		const ok = await repository.setDisplayedBadge(playerUuid, parsed.data);
		if (!ok)
		{
			return (res.status(403).json({
				error: "badge_not_unlocked", 
				message: `cannot display chosen badge "${parsed.data.badgeId}", it's still locked`
			}));
		}
		return (res.status(204).end());
	};
}