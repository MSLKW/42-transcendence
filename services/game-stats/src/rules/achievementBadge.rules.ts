import { type AchievementId, type BadgeId } from "@big2/game-stats-types/game-stats";

export const BADGE_FOR_ACHIEVEMENT: Partial<Record<AchievementId, BadgeId>> = {
	best_straight_flush:	"flush_with_pride",
	win_no_pass:			"never_folds",
};

// syntax: ?? null === “if there is no entry, use null”.
export function getBadgeForAchievement(achievementId: AchievementId): BadgeId | null
{ return (BADGE_FOR_ACHIEVEMENT[achievementId] ?? null); }

