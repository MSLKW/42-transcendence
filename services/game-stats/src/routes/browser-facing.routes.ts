import { Router } from "express";
import { getOwnPlayerGameData } from "../handlers/browser-facing/getOwnPlayerGameData";
import { getPublicPlayerGameData } from "../handlers/browser-facing/getPublicPlayerGameData";
import { putDisplayedBadge } from "../handlers/browser-facing/putDisplayedBadge";
import { postEasterEggFound } from "../handlers/browser-facing/postEasterEggFound";
import { requireUser } from "../middleware/requireUser";
import { GameStatsRepository } from "../repositories/interfaces/GameStatsRepository";


// important endpoint designs: 
	// 1. is it a browser-facing or internal route?
	// 2. who fetches these endpoints?
	// 3. requires cookie?
	
// BROWSER FACING: website, cookie required unless no middleware (requireUser) 
export function createBrowserFacingRouter(repository: GameStatsRepository): Router
{
	const browserFacingRouter = Router();
	
	browserFacingRouter.get("/own-player-game-data", requireUser, getOwnPlayerGameData(repository));		// what?: player's own all 3 accumulated data (stats + all achievements + all badges)
	browserFacingRouter.get("/public-player-game-data/:playerUuid", getPublicPlayerGameData(repository));	// what?: other client looked up people's profile page, see all except all unlocked badges
	browserFacingRouter.put("/displayed-badge", requireUser, putDisplayedBadge(repository));				// when?: user change displayed badge in profile section popup
	// TODO (polish): do this later only after current badges are complete and working
	browserFacingRouter.post("/easter-egg-found", requireUser, postEasterEggFound(repository));				// what?: award user easter egg badges

	return browserFacingRouter;
}

