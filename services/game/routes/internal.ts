import { Request, Response } from "express";
import { postgres } from "./postgres";
import { playerStats } from "@big2/game-schema";
import { eq } from "drizzle-orm";


// export function getInternalPlayerStats() {
export function getInternalInfosForProfile() {
	return ( async ( req: Request, res: Response ) => {
		const id = req.body.id;
		if (!id)
			return res.status(404).json({ error: "User not found" });
		
		const stats = await postgres
			.select()
			.from(playerStats)
			.where(eq(playerStats.playerId, id));
		
		return res.status(200).json(stats);
		// return res.status(200).json({
		// 	level: stats.level,
		// 	xp: stats.xp,
		// 	totalPlayed: stats.totalPlayed,
		// 	totalWins: stats.totalWins,
		// 	totalLoss: stats.totalLoss,
		// 	winStreak: stats.winStreak
	})
}