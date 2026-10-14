// 1. Achievement
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

export type AchievementDates = Record<AchievementLabel, string | null>;


// 2. Badge
export const BADGES = [
	{ label: "Newcomer", 		minLevel: 0 },
	{ label: "Beginner's Luck",	minLevel: 1 },
	{ label: "Challenger", 		minLevel: 5 },
	{ label: "Enthusiast", 		minLevel: 10 },
	{ label: "Risk Taker", 		minLevel: 20 },
	{ label: "The Strategist", 	minLevel: 35 },
	{ label: "Big 2 Champion", 	minLevel: 50 },
] as const satisfies readonly { label: string; minLevel: number }[];

export type BadgeLabel = (typeof BADGES)[number]["label"];

export const badgesForLevel = (level: number): BadgeLabel[] =>
	BADGES.filter((b) => level >= b.minLevel).map((b) => b.label);