import { AchievementUnlockStatusSchema } from "../shared/achievements.types";
import { BADGE_IDS, BadgeUnlockStatusSchema } from "../shared/badges/badges.types";
import { LevelProgressSchema, PlayerStatsDataSchema } from "../shared/stats.types";
import z from "zod";


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



// 		POST /easter-egg-found
// * request types	= EasterEggRequest; playerUuid comes from the validated cookie
// * response types	= EasterEggResponse or 404 (unknown egg or not earned)
export const EasterEggResponseSchema = z.object({
	newlyGrantedBadgeIdForEasterEgg:	z.enum(BADGE_IDS).nullable(),
});
export type EasterEggResponse = z.infer<typeof EasterEggResponseSchema>;
