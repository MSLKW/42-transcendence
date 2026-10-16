import { Router } from "express";
import { gameEndStats } from "../handlers/gameEndStats";
import { achievementUnlocked } from "../handlers/achievementUnlocked";
import { badgeUnlocked } from "../handlers/badgeUnlocked";
import { displayedBadge } from "../handlers/displayedBadge";
import { publicPlayerGameData } from "../handlers/publicPlayerGameData";
import { healthCheck } from "../handlers/healthCheck";
import { ownPlayerGameData } from "../handlers/ownPlayerGameData";
import { requireUser } from "../middleware/requireUser";


// important endpoint designs: 
	// 1. who fetches these endpoints?
	// 2. requires cookie?


export const gameStatsRouter = Router();

// game-server & other microservices(badges-unlocked only), no
gameStatsRouter.post("/game-end-stats", gameEndStats);							// when?: after each game round ends 
gameStatsRouter.post("/achievement-unlocked", achievementUnlocked); 		// when?: on realtime update during in game playtime
gameStatsRouter.post("/badge-unlocked", badgeUnlocked); 					// when?: on realtime update (only for the polished badges that has various kind of rules, not just upon minLevels) 

// website, yes
// to determine this is really requested by the client themselves
gameStatsRouter.put("/displayed-badge", requireUser, displayedBadge);					// when?: user change displayed badge
gameStatsRouter.get("/own-player-game-data", requireUser, ownPlayerGameData);			// what?: player's own all 3 accumulated data (stats + all achievements + all badges)

// website, no 
// coz requested by other clients 
gameStatsRouter.get("/public-player-game-data/:uuid", publicPlayerGameData);	// what?: other client looked up people's profile page, see all except all unlocked badges

// docker, no
gameStatsRouter.get("/health", healthCheck);