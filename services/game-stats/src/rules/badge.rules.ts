import { 
	BADGE_IDS, 
	type BadgeId, 
	type AchievementId, 
	type PlayerStatsData 
} from "@big2/game-stats-types";

// rules on the player's new stats. Partial: not every badge comes from stats.
export const STATS_BADGE_RULES: Partial<Record<BadgeId, (s: PlayerStatsData) => boolean>> = {
	fresh_deal:			() => true,
	beginners_luck:		(s) => s.level >= 1,
	worthy_opponent:	(s) => s.level >= 5,
	enthusiast:			(s) => s.level >= 10,
	risk_taker:			(s) => s.level >= 20,
	the_strategist:		(s) => s.level >= 35,
	big_2_champion:		(s) => s.level >= 50,
	double_digits:		(s) => s.totalWins >= 10,
	century_club:		(s) => s.totalPlayed >= 100,
	hot_hand:			(s) => s.winStreak >= 5,
};

export const getEarnedStatsBadges = (stats: PlayerStatsData): BadgeId[] =>
	BADGE_IDS.filter((id) => STATS_BADGE_RULES[id]?.(stats) ?? false);

// achievement -> badge it also grants
export const BADGE_FOR_ACHIEVEMENT: Partial<Record<AchievementId, BadgeId>> = {
	best_straight_flush:	"flush_with_pride",
	win_no_pass:			"never_folds",
};

// syntax: ?? null === “if there is no entry, use null”.
export function getBadgeForAchievement(achievementId: AchievementId): BadgeId | null
{
	return (BADGE_FOR_ACHIEVEMENT[achievementId] ?? null);
}

