export type AchievementLabel = 
	"FIRST_LOGIN"
	| "LOGIN_1_WEEK"
	| "PLAYED_1_GAME"
	| "PLAYED_10_GAMES"
	| "PLAYED_42_GAMES"
	| "FIRST_WIN"
	| "WIN_STREAK_2"
	| "WIN_STREAK_5"
	| "WIN_STREAK_10"
	| "MASTER_COLLECTOR";

export const NULL_ACHIEVEMENTS: Record<AchievementLabel, Date | null> = {
	"FIRST_LOGIN": null,
	"LOGIN_1_WEEK": null,
	"PLAYED_1_GAME": null,
	"PLAYED_10_GAMES": null,
	"PLAYED_42_GAMES": null,
	"FIRST_WIN": null,
	"WIN_STREAK_2": null,
	"WIN_STREAK_5": null,
	"WIN_STREAK_10": null,
	"MASTER_COLLECTOR": null
} as const;

export const MEDAL_LABEL = [
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
export type MEDAL_TYPE = typeof MEDAL_LABEL[number];
