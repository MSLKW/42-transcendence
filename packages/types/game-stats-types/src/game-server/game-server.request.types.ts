import z from "zod";
import { ACHIEVEMENT_IDS } from "../shared/achievements.types";


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
// * extracted request input	= game-stats's GameEndStatsInput (to store humans' details only, filter out bots)
// * response types				= game-stats-types's GameEndStatsResponse
