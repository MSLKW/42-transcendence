import z from "zod";


export const BADGE_IDS = [
	"fresh_deal",
	"beginners_luck",
	"worthy_opponent",
	"enthusiast",
	"risk_taker",
	"the_strategist",
	"big_2_champion",
	"double_digits",
	"century_club",
	"hot_hand",
	"flush_with_pride",
	"never_folds",
	"curious_cat",
	"imposter",
	"social_butterfly",
	"connoisseur",
] as const;
export type BadgeId = (typeof BADGE_IDS)[number];

// true = unlocked, false = locked. 
// Secret badges are absent until unlocked, so partial.
export const BadgeUnlockStatusSchema = z.partialRecord(z.enum(BADGE_IDS), z.boolean());
export type BadgeUnlockStatus = z.infer<typeof BadgeUnlockStatusSchema>;

// secret badges: left out of responses until unlocked
export const SECRET_BADGE_IDS: readonly BadgeId[] = [
	"curious_cat", 
	"imposter", 
	"social_butterfly", 
	"connoisseur",
];


// TODO (website): below are the descriptions for each badges
// * display text for the UI. Record<BadgeId, string> makes TypeScript error if a badge has no name.
// export const BADGE_NAMES: Record<BadgeId, string> = {
// 	fresh_deal:			"Fresh Deal",
// 	beginners_luck:		"Beginner's Luck",
// 	worthy_opponent:	"Worthy Opponent",
// 	enthusiast:			"Enthusiast",
// 	risk_taker:			"Risk Taker",
// 	the_strategist:		"The Strategist",
// 	big_2_champion:		"Big 2 Champion",
// 	double_digits:		"Double Digits",
// 	century_club:		"Century Club",
// 	hot_hand:			"Hot Hand",
// 	flush_with_pride:	"Flush With Pride",
// 	never_folds:		"Never Folds",
// 	curious_cat:		"Curious Cat",
// 	imposter:			"Imposter",
// 	social_butterfly:	"Social Butterfly",
// 	connoisseur:		"Connoisseur",
// };
//
// * have all of these listed at own player profile view
// export const BADGE_HINTS: Partial<Record<BadgeId, string>> = {
// 	fresh_deal:			"Fresh start!",
// 	beginners_luck:		"Reach Level 1",
// 	worthy_opponent:	"Reach Level 5",
// 	enthusiast:			"Reach Level 10",
// 	risk_taker:			"Reach Level 20",
// 	the_strategist:		"Reach Level 35",
// 	big_2_champion:		"Reach Level 50",
// 	double_digits:		"Win 10 games",
// 	century_club:		"Played 100 games",
// 	hot_hand:			"Win streak 5",
// 	flush_with_pride:	"Played with Straight Flush",
// 	never_folds:		"Win without skipping",
//
// 	* * no entries for secret badges as below, 
// 	* * easter eggs badges will be given by surprise
// 	* * below is just for explanations to frontend
// 	* curious_cat:			"Click hidden button within Privacy Policy",
// 	* imposter:			"Create username with bot- prefix",
// 	* social_butterfly:	"Have 42 people in friend list",
// 	* connoisseur:			"Chose specific avatar",
//
// };
