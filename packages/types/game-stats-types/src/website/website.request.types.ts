import z from "zod";
import { BADGE_IDS } from "../shared/badges/badges.types";


// 		POST /easter-egg-found
// * request types	= EasterEggRequest; playerUuid comes from the validated cookie
// * response types	= EasterEggResponse or 404 (unknown egg or not earned, deliberately the same)
export const EasterEggRequestSchema = z.object({
	eggId:	z.string(),								// not an enum, so the egg list stays out of the shared package to not get exposed to clients in browser
});
export type EasterEggRequest = z.infer<typeof EasterEggRequestSchema>;



// 		PUT /displayed-badge
// * request types	= DisplayedBadgeRequest; playerUuid comes from the validated cookie
// * response types	= 
// 		booleans: 
// 			true - 204(harmless to still choose the same previous displayed badge), or 
// 			false - 403(badge is still locked)
export const DisplayedBadgeRequestSchema = z.object({
	badgeId:	z.enum(BADGE_IDS),
});
export type DisplayedBadgeRequest = z.infer<typeof DisplayedBadgeRequestSchema>;


