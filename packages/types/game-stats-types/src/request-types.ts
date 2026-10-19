import { ACHIEVEMENT_LABELS } from "./achievements";
import { BADGE_LABELS } from "./badges";
import { z } from "zod";

// 		POST /badge-unlocked
// * request types	= body is zod validated
// * response types	= either 200 OK or specific error message
export const BadgeUnlockedRequestSchema = z.object({
	playerUuid:	z.uuid(),
	badge:		z.enum(BADGE_LABELS),
	unlockedAt:	z.iso.datetime(),
});
export type BadgeUnlockedRequest = z.infer<typeof BadgeUnlockedRequestSchema>;


// 		POST /achievement-unlocked
// * request types	= body is zod validated
// * response types	= either 200 OK or specific error message
export const AchievementUnlockedRequestSchema = z.object({
	playerUuid:		z.uuid(),
	achievement:	z.enum(ACHIEVEMENT_LABELS),
	unlockedAt:		z.iso.datetime(),
});
export type AchievementUnlockedRequest = z.infer<typeof AchievementUnlockedRequestSchema>;


// 		PUT /displayed-badge
// * request types	= body is zod validated + playerUuid comes from after validating the recieved cookie to auth, not the body
// * response types	= either 200 OK or specific error message
export const DisplayedBadgeRequestSchema = z.object({
	badge:	z.enum(BADGE_LABELS),
});
export type DisplayedBadgeRequest = z.infer<typeof DisplayedBadgeRequestSchema>;


// 		POST /game-end-stats
// * request types				= game-types's GameEndStatsTransmit
// * extracted request input	= input is zod validated as below
// * response types				= game-stats-types's GameEndStatsResponse
export const GameEndStatsInputSchema = z.object({
	roundId:			z.uuid(),										// uuid
	winnerPlayerUuid:	z.string(),										// may be a bot id, so its a string, not uuid
	playerXpGains:		z.record(z.string(), z.int().nonnegative()),	// for each players/bots in the round -> non-negative integers: guaranteed by game-types's GameEndStatsTransmitSchema
});
export type GameEndStatsInput = z.infer<typeof GameEndStatsInputSchema>;