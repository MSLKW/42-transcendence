import z from "zod";


export const ACHIEVEMENT_IDS = [
	"best_single",
	"best_double",
	"best_triple",
	"best_straight",
	"best_flush",
	"best_full_house",
	"best_four_of_a_kind",
	"best_straight_flush",
	"play_three_diamonds",
	"play_two_spades",
	"win_no_pass",
	"first_win",
] as const;
export type AchievementId = (typeof ACHIEVEMENT_IDS)[number];

// string = unlocked (time), null = locked
export const AchievementUnlockStatusSchema = z.record(
	z.enum(ACHIEVEMENT_IDS),
	z.iso.datetime().nullable(),
);
export type AchievementUnlockStatus = z.infer<typeof AchievementUnlockStatusSchema>;


// TODO (website): below are the descriptions for each achievements
// // display text for the UI. Record<BadgeId, string> makes TypeScript error if a badge has no name.
// export const ACHIEVEMENT_NAMES: Record<AchievementId, string> = {
// 	best_single:			"High",
// 	best_double:			"Double",
// 	best_triple:			"Triple",
// 	best_straight:			"Straight",
// 	best_flush:				"Flush",
// 	best_full_house:		"Full House",
// 	best_four_of_a_kind:	"4 Of A Kind",
// 	best_straight_flush:	"Straight Flush",
// 	play_three_diamonds:	"3 Of Diamonds",
// 	play_two_spades:		"2 Of Spades",
// 	win_no_pass:			"No Pass",
// 	first_win:				"First Win",
// };
