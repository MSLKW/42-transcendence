import { BADGE_IDS, BadgeUnlockStatusSchema } from "../shared/badges/badges.types";
import { PublicPlayerGameDataResponseSchema } from "../shared/shared.response.types";
import z from "zod";


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
