import { AchievementUnlockStatusSchema } from "./achievements";
import { BADGE_LABELS, BadgeUnlockStatusSchema } from "./badges";
import { z } from "zod";


// --- shared types ---
// export type PlayerStatsData = {
// 	playerUuid:		string;
// 	level:			number;
// 	xp:				number;
// 	totalPlayed:	number;
// 	totalWins:		number;
// 	winStreak:		number;
// 	displayedBadge:	BadgeLabel;
// };
export const PlayerStatsDataSchema = z.object({
	playerUuid: 	z.uuid(),
	level:			z.int().nonnegative(),
	xp:				z.int().nonnegative(),
	totalPlayed:	z.int().nonnegative(),
	totalWins: 		z.int().nonnegative(),
	winStreak: 		z.int().nonnegative(),
	displayedBadge: z.enum(BADGE_LABELS),
});
export type PlayerStatsData = z.infer<typeof PlayerStatsDataSchema>;


// 		GET /public-player-game-data/:uuid
// * request types	= GET has no body
// * response types	= plain types
// export type PublicPlayerGameDataResponse = {
// 	stats:			PlayerStatsData;
// 	achievements:	AchievementUnlockStatus;
// };
export const PublicPlayerGameDataResponseSchema = z.object({
	stats:			PlayerStatsDataSchema,
	achievements:	AchievementUnlockStatusSchema,
});
export type PublicPlayerGameDataResponse = z.infer<typeof PublicPlayerGameDataResponseSchema>;


// 		GET /own-player-game-data
// * request types	= GET has no body; playerUuid comes from the cookie header (validated with auth)
// * response types	= plain types
// export type OwnPlayerGameDataResponse = 
// 	PublicPlayerGameDataResponse & {
// 	badges:	BadgeUnlockStatus;
// };
export const OwnPlayerGameDataResponseSchema = 
	PublicPlayerGameDataResponseSchema.extend({
	badges:	BadgeUnlockStatusSchema,
});
export type OwnPlayerGameDataResponse = z.infer<typeof OwnPlayerGameDataResponseSchema>;


// 		POST /game-end-stats
// * request types	= game-server make within game-types (GameEndStatsTransmit)
// * response types	= plain types
// export type PlayerGameEndResult = {
// 	stats:			PlayerStatsData;
// 	previousLevel:	number;
// 	leveledUp:		boolean;
// 	newBadges:		BadgeLabel[];	
// };
export const PlayerGameEndResultSchema = z.object({
	stats:			PlayerStatsDataSchema,
	previousLevel:	z.int().nonnegative(),
	leveledUp:		z.boolean(),
	newBadges:		z.array(z.enum(BADGE_LABELS)), // only on badges that depends on stats
});
export type PlayerGameEndResult = z.infer<typeof PlayerGameEndResultSchema>;

export const GameEndResponseSchema = z.object({
	roundId:		z.uuid(),
	playersStats:	z.record(z.uuid(), PlayerGameEndResultSchema),
});
export type GameEndResponse = z.infer<typeof GameEndResponseSchema>;

