import z from "zod";
import { BADGE_IDS } from "./badges/badges.types";


// --- as per player_stats table in db schema ---
export const PlayerStatsDataSchema = z.object({
	playerUuid: 		z.uuid(),
	level:				z.int().nonnegative(),
	xp:					z.int().nonnegative(),
	totalPlayed:		z.int().nonnegative(),
	totalWins: 			z.int().nonnegative(),
	winStreak: 			z.int().nonnegative(),
	displayedBadgeId:	z.enum(BADGE_IDS),
});
export type PlayerStatsData = z.infer<typeof PlayerStatsDataSchema>;

// --- to display at the browser's result page / profile section ---
export const LevelProgressSchema = z.object({
	currentLevel:					z.int().nonnegative(),			// first level is 0
	currentLevelXpEarned:			z.int().nonnegative(),
	currentLevelXpThreshold:		z.int().positive().nullable(),	// total XP size of the current level. nullable if reach MAX_LEVEL, positive coz even BASE_XP_LEVEL_0 is 100. 
	currentLevelProgressPercentage:	z.int().min(0).max(100),		// TODO (website): frontend shows `${progressPercentage}%`, need to manually add '%' if want to present in percentage over the visual bar
});
export type LevelProgress = z.infer<typeof LevelProgressSchema>;