import { Request, Response } from "express";
import { GameStatsRepository } from "../../repositories/GameStatsRepository";
import { AchievementUnlockedRequestSchema, AchievementUnlockedResponseSchema } from "@big2/game-stats-types";
import z from "zod";
import { isForeignKeyViolation } from "@big2/postgres-client";

export function postAchievementUnlocked(repository: GameStatsRepository)
{
	return async (req: Request, res: Response) =>
	{
		// 1. correct request shape
		// block invalid achievements that isnt as per types 
		const parsed = AchievementUnlockedRequestSchema.safeParse(req.body);
		if (!parsed.success)
		{
			console.error(z.prettifyError(parsed.error));
			return (res.status(400).json({
				error: "invalid_request_body",
				message: z.prettifyError(parsed.error),
			}));
		}
		
		try
		{
			// 2. return drizzle query's result:
			// 		isNewlyGrantedAchievement: true (1st time) / false (previously granted already)
			// 		newlyGrantedBadgeIdForAchievement: badgeId (upon certain newly granted achievements) / null (previously granted already)
			// 		etc (just for other microservices' infos, not decision maker)
			// only game-server knows the rules on giving achievements, 
			// so game-stats only control statuses (already granted or not) for realtime notifications
			// thus only game-server can reach this endpoint via token
			const result = await repository.grantAchievement(parsed.data);

			// 3. valid response shape
			// safety net to ensure its in the right shape, updatedAt is stripped off in drizzle query already
			const cleanResult = AchievementUnlockedResponseSchema.parse(result); 
			return (res.json(cleanResult));
		}
		catch (error: any)
		{
			// non-exist playerUuid, thrown postgres error foreign_key_violation
			if (isForeignKeyViolation(error))
				return (res.status(404).json({ error: "invalid_player_uuid", message: "Invalid playerUuid" }));
			// console.error("achievementUnlocked: something went wrong"); //? whould this be here? wont users sees it in browser?
			throw error;		
		}
	};
}