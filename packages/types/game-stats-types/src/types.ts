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
