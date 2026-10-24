import { ACHIEVEMENT_IDS } from "./achievements";
import { BADGE_IDS } from "./badges";
import z from "zod";


// 		POST /easter-egg-found
// * request types	= EasterEggRequest; playerUuid comes from the validated cookie
// * response types	= EasterEggResponse or 404 (unknown egg or not earned, deliberately the same)
export const EasterEggRequestSchema = z.object({
	eggId:	z.string(),								// not an enum, so the egg list stays out of the shared package to not get exposed to clients in browser
});
export type EasterEggRequest = z.infer<typeof EasterEggRequestSchema>;


// 		PUT /displayed-badge
// * request types	= DisplayedBadgeRequest; playerUuid comes from the validated cookie
// * response types	= 204(harmless to still choose the same previous displayed badge) or 403(badge is still locked)
export const DisplayedBadgeRequestSchema = z.object({
	badgeId:	z.enum(BADGE_IDS),
});
export type DisplayedBadgeRequest = z.infer<typeof DisplayedBadgeRequestSchema>;


// 		POST /achievement-unlocked
// * request types	= AchievementUnlockedRequest (requested by game-server)
// * response types	= AchievementUnlockedResponse or 404(invalid playerUuid recieved from body)
export const AchievementUnlockedRequestSchema = z.object({
	playerUuid:		z.uuid(),
	achievementId:	z.enum(ACHIEVEMENT_IDS),
});
export type AchievementUnlockedRequest = z.infer<typeof AchievementUnlockedRequestSchema>;


// 		POST /game-end-stats
// * request types				= game-types's GameEndStatsTransmit (requested by game-server)
// * extracted request input	= GameEndStatsInput (to store humans' details only, filter out bots)
// * response types				= game-stats-types's GameEndStatsResponse
export const GameEndStatsInputSchema = z.object({
	roundId:			z.uuid(),
	winnerHumanUuid:	z.uuid().nullable(),						// null when a bot won
	humanXpGains:		z.record(z.uuid(), z.int().nonnegative()),
});
export type GameEndStatsInput = z.infer<typeof GameEndStatsInputSchema>;
