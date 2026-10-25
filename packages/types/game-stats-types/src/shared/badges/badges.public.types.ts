// safe to ship to the browser.
export const PUBLIC_BADGE_IDS = [
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
] as const;
export type PublicBadgeId = (typeof PUBLIC_BADGE_IDS)[number];

// TODO (website): display text for the UI. Record<PublicBadgeId, string> makes TypeScript error if a badge has no name.
// export const BADGE_NAMES: Record<PublicBadgeId, string> = {
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
// };
//
// * have all of these listed at own player profile view
// export const BADGE_HINTS: Record<PublicBadgeId, string> = {
// 	fresh_deal:			"Fresh start at Level 0!",
// 	beginners_luck:		"Reach Level 1",
// 	worthy_opponent:	"Reach Level 5",
// 	enthusiast:			"Reach Level 10",
// 	risk_taker:			"Reach Level 20",
// 	the_strategist:		"Reach Level 50",
// 	big_2_champion:		"Reach Level 100",
// 	double_digits:		"Win 10 games",
// 	century_club:		"Played 100 games",
// 	hot_hand:			"Win streak 5",
// 	flush_with_pride:	"Played with Straight Flush",
// 	never_folds:		"Win without skipping",
// };

// TODO (website): notes for the frontend team (explanations only, not shown to players):
// * curious_cat:		"Click hidden button within Privacy Policy",
// * imposter:			"Create username with bot- prefix",
// * social_butterfly:	"Have 42 people in friend list",
// * connoisseur:		"Chose specific avatar",