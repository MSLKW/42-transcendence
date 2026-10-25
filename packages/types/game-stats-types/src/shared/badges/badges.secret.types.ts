// SECRET BADGES: 
// the ids are visible to the browser (they are inside BADGE_IDS), 
// but the unlock rules are not
// The ids are intentionally vague, so knowing them gives no hint on how to earn them.
// The real rules & unlock logic lives only in game-stats (rules/easterEgg).

export const SECRET_BADGE_IDS = [
	"curious_cat", 
	"imposter", 
	"social_butterfly", 
	"connoisseur",
] as const;
export type SecretBadgeId = (typeof SECRET_BADGE_IDS)[number];
