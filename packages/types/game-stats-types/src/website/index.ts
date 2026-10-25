export { PUBLIC_BADGE_IDS, type PublicBadgeId } from "../shared/badges/badges.public.types";
export type * from "../shared/achievements.types";
export type * from "../shared/badges/badges.types";
export type * from "../shared/stats.types";
export type * from "./website.request.types";
export type * from "./website.response.types";

// in package.json
	// "sideEffects": false is optional but useful. It tells the website’s bundler that unused modules can be dropped, so only what the entry really exports gets in.