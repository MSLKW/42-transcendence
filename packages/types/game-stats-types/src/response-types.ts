import { ACHIEVEMENT_IDS, AchievementUnlockStatusSchema } from "./achievements";
import { BADGE_IDS, BadgeUnlockStatusSchema } from "./badges";
import z from "zod";


// --- shared types, as per player_stats table in db schema ---
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

// --- shared types, for level bar vicualizer / percentage ---
export const LevelProgressSchema = z.object({
	xpEarnedInCurrentLevel:		z.int().nonnegative(),			// xp earned since the current level started
	xpRequiredToGoNextLevel:	z.int().positive().nullable(),	// total xp size of the current level. null = max level reached
});
export type LevelProgress = z.infer<typeof LevelProgressSchema>;


// 		GET /public-player-game-data/:playerUuid
// * request types	= GET has no body
// * response types	= plain types
export const PublicPlayerGameDataResponseSchema = z.object({
	stats:			PlayerStatsDataSchema,
	levelProgress:	LevelProgressSchema,
	achievements:	AchievementUnlockStatusSchema,
});
export type PublicPlayerGameDataResponse = z.infer<typeof PublicPlayerGameDataResponseSchema>;


// 		GET /own-player-game-data
// * request types	= GET has no body; playerUuid comes from the cookie header (validated with auth)
// * response types	= plain types
export const OwnPlayerGameDataResponseSchema = 
	PublicPlayerGameDataResponseSchema.extend({
	badges:	BadgeUnlockStatusSchema,			// display all public badges
});
export type OwnPlayerGameDataResponse = z.infer<typeof OwnPlayerGameDataResponseSchema>;


// 		POST /game-end-stats
// * request types				= game-types's GameEndStatsTransmit (requested by game-server)
// * extracted request input	= GameEndStatsInput (to store humans' details only, filter out bots)
// * response types				= game-stats-types's GameEndStatsResponse
export const PlayerGameEndStatsResultSchema = z.object({
	stats:			PlayerStatsDataSchema,
	levelProgress:	LevelProgressSchema,
	previousLevel:	z.int().nonnegative(),
	isLeveledUp:	z.boolean(),
	newBadgeIds:	z.array(z.enum(BADGE_IDS)), // only on badges that depends on stats
});
export type PlayerGameEndStatsResult = z.infer<typeof PlayerGameEndStatsResultSchema>;

export const GameEndStatsResponseSchema = z.object({
	roundId:				z.uuid(),
	playerAccumulatedStats:	z.record(z.uuid(), PlayerGameEndStatsResultSchema),
});
export type GameEndStatsResponse = z.infer<typeof GameEndStatsResponseSchema>;


// 		POST /easter-egg-found
// * request types	= EasterEggRequest; playerUuid comes from the validated cookie
// * response types	= EasterEggResponse or 404 (unknown egg or not earned, deliberately the same)
export const EasterEggResponseSchema = z.object({
	newBadgeId:	z.enum(BADGE_IDS).nullable(),
});
export type EasterEggResponse = z.infer<typeof EasterEggResponseSchema>;


// 		POST /achievement-unlocked
// * request types	= AchievementUnlockedRequest (requested by game-server)
// * response types	= AchievementUnlockedResponse or 404(invalid playerUuid recieved from URL)
export const AchievementUnlockedResponseSchema = z.object({
	playerUuid:							z.uuid(),
	achievementId:						z.enum(ACHIEVEMENT_IDS),
	isNewlyGrantedAchievement:			z.boolean(),
	newlyGrantedBadgeIdForAchievement:	z.enum(BADGE_IDS).nullable(),			
});
export type AchievementUnlockedResponse = z.infer<typeof AchievementUnlockedResponseSchema>;
