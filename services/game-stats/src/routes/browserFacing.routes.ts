import { Router } from "express";
import { getOwnPlayerGameData } from "../handlers/browserFacing/getOwnPlayerGameData";
import { getPublicPlayerGameData } from "../handlers/browserFacing/getPublicPlayerGameData";
import { putDisplayedBadge } from "../handlers/browserFacing/putDisplayedBadge";
import { postEasterEggFound } from "../handlers/browserFacing/postEasterEggFound";
import { requireUser } from "../middleware/requireUser";
import { GameStatsRepository } from "../repositories/GameStatsRepository";


// important endpoint designs: 
	// 1. is it a browserFacing or internal route?
	// 2. who fetches these endpoints?
	// 3. requires cookie?
	
// BROWSER FACING: website, cookie required unless no middleware requireUser
export function createBrowserFacingRouter(repository: GameStatsRepository): Router
{
	const browserFacingRouter = Router();
	
	browserFacingRouter.get("/own-player-game-data", requireUser, getOwnPlayerGameData(repository));		// what?: player's own all 3 accumulated data (stats + all achievements + all badges)
	browserFacingRouter.get("/public-player-game-data/:playerUuid", getPublicPlayerGameData(repository));	// what?: other client looked up people's profile page, see all except all unlocked badges
	browserFacingRouter.put("/displayed-badge", requireUser, putDisplayedBadge(repository));				// when?: user change displayed badge in profile section popup
	browserFacingRouter.post("/easter-egg-found", requireUser, postEasterEggFound(repository));				// what?: award user easter egg badges

	return browserFacingRouter;
}

