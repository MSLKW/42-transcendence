import z from "zod";
import { LevelProgressSchema, PlayerStatsDataSchema } from "./stats.types";
import { AchievementUnlockStatusSchema } from "./achievements.types";


// 		GET /public-player-game-data/:playerUuid
// * request types	= GET has no body
// * response types	= plain types
export const PublicPlayerGameDataResponseSchema = z.object({
	stats:			PlayerStatsDataSchema,
	levelProgress:	LevelProgressSchema,
	achievements:	AchievementUnlockStatusSchema,
});
export type PublicPlayerGameDataResponse = z.infer<typeof PublicPlayerGameDataResponseSchema>;
