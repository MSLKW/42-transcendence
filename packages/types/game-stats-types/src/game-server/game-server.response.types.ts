import z from "zod";
import { BADGE_IDS } from "../shared/badges/badges.types";
import { ACHIEVEMENT_IDS } from "../shared/achievements.types";
import { LevelProgressSchema, PlayerStatsDataSchema } from "../shared/stats.types";



// 		POST /achievement-unlocked
// * request types	= AchievementUnlockedRequest
// * response types	= AchievementUnlockedResponse
export const AchievementUnlockedResponseSchema = z.object({
	playerUuid:							z.uuid(),
	achievementId:						z.enum(ACHIEVEMENT_IDS),
	isNewlyGrantedAchievement:			z.boolean(),
	newlyGrantedBadgeIdForAchievement:	z.enum(BADGE_IDS).nullable(),			
});
export type AchievementUnlockedResponse = z.infer<typeof AchievementUnlockedResponseSchema>;



// 		POST /game-end-stats
// * request types				= game-types's GameEndStatsTransmit
// * extracted request input	= game-stats's GameEndStatsInput (to store humans' details only, filter out bots)
// * response types				= game-stats-types's GameEndStatsResponse
export const PlayerGameEndStatsResultSchema = z.object({
	stats:							PlayerStatsDataSchema,
	levelProgress:					LevelProgressSchema,
	previousLevel:					z.int().nonnegative(),
	isLeveledUp:					z.boolean(),
	newlyGrantedBadgeIdsForStats:	z.array(z.enum(BADGE_IDS)), // only on badges that depends on stats
});
export type PlayerGameEndStatsResult = z.infer<typeof PlayerGameEndStatsResultSchema>;

export const GameEndStatsResponseSchema = z.object({
	roundId:				z.uuid(),
	playerAccumulatedStats:	z.record(z.uuid(), PlayerGameEndStatsResultSchema),
});
export type GameEndStatsResponse = z.infer<typeof GameEndStatsResponseSchema>;
