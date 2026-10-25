import { Request, Response } from "express";
import { GameStatsRepository } from "../../repositories/GameStatsRepository";
import { getPlayerUuid } from "../../middleware/requireUser";
import { EasterEggRequestSchema, EasterEggResponseSchema } from "@big2/game-stats-types/game-stats";
import { EASTER_EGGS } from "../../rules/easterEgg/easterEggBadge.rules";
import z from "zod";

export function postEasterEggFound(repository: GameStatsRepository)
{
	return async (req: Request, res: Response) =>
	{
		// 1. valid uuid existance
		// the uuid is provided by auth, so the uuid is trusted to exist in database. 
		const playerUuid = getPlayerUuid(res);

		// 2. correct request shape
		// block invalid easter egg ids
		const parsed = EasterEggRequestSchema.safeParse(req.body);
		if (!parsed.success)
		{
			console.error(z.prettifyError(parsed.error));
			return (res.status(400).json({
				error: "invalid_request_body",
				message: "Invalid request body",
			}));
		}

		// 3. valid eggId via EASTER_EGG lookup table
		const { eggId } = parsed.data;
		const egg = Object.hasOwn(EASTER_EGGS, eggId) ? EASTER_EGGS[eggId] : null;
		if (!egg)
			return (res.status(404).json({ error: "not_found" }));

		// 4. verify on eggs that have verifier
		if (egg.verify)
		{
			let isVerified: boolean;

			try
			{
				isVerified = await egg.verify(playerUuid);
			}
			catch (error: unknown)
			{
				console.error("easter egg verification failed", error);
				return (res.status(503).json({ error: "service_unavailable" }));	// profile or friends is down
			}

			if (!isVerified)
				return (res.status(404).json({ error: "not_found"}));
		}
		
		// 5. grant upon first time only 
		// return drizzle query's result => 
		// 		granted(easter egg's badgeId itself), or
		// 		not granted(null) = ineligible / previously granted already
		const result = repository.grantEasterEggBadge(playerUuid, egg.badgeId);

		// 3. valid response shape
		// safety net to ensure its in the right shape, updatedAt is stripped off in drizzle query already
		const cleanResult = EasterEggResponseSchema.parse(result); 
		return (res.json( cleanResult ));
	};
}