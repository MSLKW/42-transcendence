import { z } from "zod";

export const ACHIEVEMENT_LABELS = [ 
	"High",
	"Double",
	"Triple",
	"Straight",
	"Flush",
	"Full House",
	"4 Of A Kind",
	"Straight Flush",
	"First Win",
	"3 Of Diamonds",
	"2 Of Spades",
	"No Pass",
] as const;

export type AchievementLabel = (typeof ACHIEVEMENT_LABELS)[number];

// Every achievement is present. string = unlocked, null = locked.
// export type AchievementUnlockStatus = Record<AchievementLabel, string | null>;
export const AchievementUnlockStatusSchema = z.record(
	z.enum(ACHIEVEMENT_LABELS), 
	z.iso.datetime().nullable(),
);
export type AchievementUnlockStatus = z.infer<typeof AchievementUnlockStatusSchema>;