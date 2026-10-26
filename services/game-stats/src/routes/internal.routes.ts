import { Router } from "express";
import { postGameEndStats } from "../handlers/internal/postGameEndStats";
import { postAchievementUnlocked } from "../handlers/internal/postAchievementUnlocked";
import { GameStatsRepository } from "../repositories/GameStatsRepository";
import { getHealthCheck } from "../handlers/internal/getHealthCheck";
import { requireStatisticsToken } from "../middleware/requireStatisticsToken";


// important endpoint designs: 
	// 1. is it a browserFacing or internal route?
	// 2. who fetches these endpoints?
	// 3. requires cookie?

// INTERNAL: any related microservices, need token instead via middleware requireStatisticsToken
export function createInternalRouter(repository: GameStatsRepository): Router
{
	const internalRouter = Router();
	
	internalRouter.get("/health", getHealthCheck);
	internalRouter.post("/game-end-stats", requireStatisticsToken, postGameEndStats(repository));							// when?: after each game round ends + update new badges too to game-server after the updated stats
	internalRouter.post("/achievement-unlocked", requireStatisticsToken, postAchievementUnlocked(repository)); 	// when?: on realtime update during in game playtime
	return internalRouter;
}

