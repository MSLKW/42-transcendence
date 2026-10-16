import { z } from "zod";

export const BADGE_LABELS = [
	"Newcomer",
	"Beginner's Luck",
	"Challenger",
	"Enthusiast",
	"Risk Taker",
	"The Strategist",
	"Big 2 Champion"
] as const;

export type BadgeLabel = (typeof BADGE_LABELS)[number];

// Every badge is present. true = unlocked, false = locked.
// export type BadgeUnlockStatus = Record<BadgeLabel, boolean>;
export const BadgeUnlockStatusSchema = z.record(z.enum(BADGE_LABELS), z.boolean());
export type BadgeUnlockStatus = z.infer<typeof BadgeUnlockStatusSchema>;


export const BADGE_MIN_LEVEL: Record<BadgeLabel, number> = {
	"Newcomer":			0,
	"Beginner's Luck":	1,
	"Challenger":		5,
	"Enthusiast":		10,
	"Risk Taker":		20,
	"The Strategist":	35,
	"Big 2 Champion":	50,
};

export const badgesForLevel = (level: number): BadgeLabel[] =>
	BADGE_LABELS.filter((label) => level >= BADGE_MIN_LEVEL[label]);