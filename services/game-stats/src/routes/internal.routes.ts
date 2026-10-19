import { Router } from "express";
import { postGameEndStats } from "../handlers/internal/postGameEndStats";
import { postAchievementUnlocked } from "../handlers/internal/postAchievementUnlocked";
import { postBadgeUnlocked } from "../handlers/internal/postBadgeUnlocked";
import { GameStatsRepository } from "../repositories/interfaces/GameStatsRepository";
import { getHealthCheck } from "../handlers/internal/getHealthCheck";


// important endpoint designs: 
	// 1. is it a browser-facing or internal route?
	// 2. who fetches these endpoints?
	// 3. requires cookie?

// INTERNAL: any related microservices, no cookie
export function createInternalRouter(repository: GameStatsRepository): Router
{
	const internalRouter = Router();
	
	internalRouter.post("/game-end-stats", postGameEndStats(repository));							// when?: after each game round ends + update new badges too to game-server after the updated stats
	internalRouter.post("/achievement-unlocked", postAchievementUnlocked(repository)); 	// when?: on realtime update during in game playtime
	internalRouter.post("/badge-unlocked", postBadgeUnlocked(repository)); 				// when?: on realtime update (only for the polished badges)  
	internalRouter.get("/health", getHealthCheck);

	return internalRouter;
}

