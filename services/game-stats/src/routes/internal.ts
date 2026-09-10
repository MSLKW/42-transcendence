import { Request, Response } from "express";
import { postgresClient } from "./postgresClient";
import { playerStats } from "@big2/game-stats-schema";
import { eq } from "drizzle-orm";


// export function getInternalPlayerStats() {
export function getInternalInfosForProfile() {
	return ( async ( req: Request, res: Response ) => {
		const id = req.params.id;
		if (!id)
			return res.status(404).json({ error: "User not found" });
		
		const [stats] = await postgresClient
			.select()
			.from(playerStats)
			.where(eq(playerStats.id, id))
			.limit(1);
		
		return res.status(200).json(stats);
		// same return as below:
		// return res.status(200).json({
		// 	level: stats.level,
		// 	xp: stats.xp,
		// 	totalPlayed: stats.totalPlayed,
		// 	totalWins: stats.totalWins,
		// 	totalLoss: stats.totalLoss,
		// 	winStreak: stats.winStreak
	})
}