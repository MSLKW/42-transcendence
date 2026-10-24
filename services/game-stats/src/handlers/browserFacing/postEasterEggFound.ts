import { Request, Response } from "express";
import { GameStatsRepository } from "../../repositories/GameStatsRepository";
import { getPlayerUuid } from "../../middleware/requireUser";
import { EasterEggRequestSchema, EasterEggResponseSchema } from "@big2/game-stats-types";
import z from "zod";
import { EASTER_EGGS } from "../../rules/easterEgg.rules";

export function postEasterEggFound(repository: GameStatsRepository)
{
	return async (req: Request, res: Response) =>
	{
		// 1. valid uuid existance
		// the uuid is provided by auth, so the uuid is trusted to exist in database. 
		const playerUuid = getPlayerUuid(res);

		// 2. correct request shape
		// block invalid easter eggs that isnt from the types
		const parsed = EasterEggRequestSchema.safeParse(req.body);
		if (!parsed.success)
		{
			console.error(z.prettifyError(parsed.error));
			return (res.status(400).json({
				error: "invalid_request_body",
				message: "Invalid request body",
			}));
		}

		// 3. only valid eggId will be granted the easter egg, based on the EASTER_EGG lookup table
		const eggId = parsed.data.eggId;
		const egg = Object.hasOwn(EASTER_EGGS, eggId) ? EASTER_EGGS[eggId] : null;
		if (!egg)
			return (res.status(404).json({ error: "not_found" }));

		// TODO: 4. check with easterEgg.rules.ts's rules & logic
		
		// 4. return drizzle query's result => 
		// 		badge granted(easter egg's badgeId itself), or 
		// 		beadge not granted(null) , either coz illegible / previously granted already
		const result = repository.grantEasterEggBadge(playerUuid, egg.badgeId);

		// 3. valid response shape
		// safety net to ensure its in the right shape, updatedAt is stripped off in drizzle query already
		const cleanResult = EasterEggResponseSchema.parse(result); 
		return (res.json({ cleanResult }));
	};
}