// SERVER-ONLY: never export this file from src/website/index.ts
export const SECRET_BADGE_IDS = [
	"curious_cat", 
	"imposter", 
	"social_butterfly", 
	"connoisseur",
] as const;
export type SecretBadgeId = (typeof SECRET_BADGE_IDS)[number];
