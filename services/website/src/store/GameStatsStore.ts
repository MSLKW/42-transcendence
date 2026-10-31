import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./AuthStore";
import { usePartyStore } from "./PartyStore";
import { handlePublicPlayerGameData } from "../api/gameStats/get_public-player-game-data/handlePublicPlayerGameData";

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
	"curious_cat",
	"imposter",
	"social_butterfly",
	"connoisseur",
] as const;
export type PublicBadgeId = (typeof PUBLIC_BADGE_IDS)[number];

export const BADGE_NAMES: Record<PublicBadgeId, string> = {
	fresh_deal:			"Fresh Deal",
	beginners_luck:		"Beginner's Luck",
	worthy_opponent:	"Worthy Opponent",
	enthusiast:			"Enthusiast",
	risk_taker:			"Risk Taker",
	the_strategist:		"The Strategist",
	big_2_champion:		"Big 2 Champion",
	double_digits:		"Double Digits",
	century_club:		"Century Club",
	hot_hand:			"Hot Hand",
	flush_with_pride:	"Flush With Pride",
	never_folds:		"Never Folds",
	curious_cat:		"Curious Cat",
	imposter:			"Imposter",
	social_butterfly:	"Social Butterfly",
	connoisseur:		"Connoisseur",
};

export const BADGE_HINTS: Record<PublicBadgeId, string> = {
	fresh_deal:			"Fresh start at Level 0!",
	beginners_luck:		"Reach Level 1",
	worthy_opponent:	"Reach Level 5",
	enthusiast:			"Reach Level 10",
	risk_taker:			"Reach Level 20",
	the_strategist:		"Reach Level 50",
	big_2_champion:		"Reach Level 100",
	double_digits:		"Win 10 games",
	century_club:		"Played 100 games",
	hot_hand:			"Win streak 5",
	flush_with_pride:	"Played with Straight Flush",
	never_folds:		"Win without skipping",
	curious_cat:		"Clicked the hidden button in privacy policy",
	imposter:			"Changed name that starts with 'bot-'",
	social_butterfly:	"42 or more friends",
	connoisseur:		"Picked one specific avatar",
};

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
export type AchievementId = typeof ACHIEVEMENT_IDS[number];

export const ACHIEVEMENT_NAMES: Record<AchievementId, string> = {
	best_single:			"High",
	best_double:			"Double",
	best_triple:			"Triple",
	best_straight:			"Straight",
	best_flush:				"Flush",
	best_full_house:		"Full House",
	best_four_of_a_kind:	"4 Of A Kind",
	best_straight_flush:	"Straight Flush",
	play_three_diamonds:	"3 Of Diamonds",
	play_two_spades:		"2 Of Spades",
	win_no_pass:			"No Pass",
	first_win:				"First Win",
};

export const ACHIEVEMENT_HINTS: Record<AchievementId, string> = {
	best_single:			"Best your opponents with a high card",
	best_double:			"Best your opponents with a pair",
	best_triple:			"'Best your opponents with a triple",
	best_straight:			"Best your opponents with a straight",
	best_flush:				"Best your opponents with a flush",
	best_full_house:		"Best your opponents with a full house",
	best_four_of_a_kind:	"Best your opponents with a 4 of a kind",
	best_straight_flush:	"Best your opponents with a straight flush",
	play_three_diamonds:	"Play 3 of diamonds",
	play_two_spades:		"Play 2 of spades",
	win_no_pass:			"Win a game without passing",
	first_win:				"Win a game",
};

export interface CachedStat {
	level: number;
	xp: number;
	totalPlayed: number;
	totalWins: number;
	winStreak: number;
	displayedBadgeId: PublicBadgeId;
	currentLevelXpThreshold: number;
	currentLevelProgressPercentage: number;
	achievements: Record<AchievementId, Date | null>;
}

interface StatsValues {
	gameStatsVerboseMode: boolean;
	cachedStats: Record<string, CachedStat>;
	cachedBadges: Record<PublicBadgeId, boolean>;
};

interface StatsState extends StatsValues {
	setCachedStats: () => Promise<void>;
	removeCachedStat: (uuid: string | null) => void;
};

export const useGameStatsStore = create<StatsState>() (
	persist(
		(set, _get) => ({
			gameStatsVerboseMode: false,
			cachedStats: {},
			cachedBadges: {
				fresh_deal: false,
				beginners_luck: false,
				worthy_opponent: false,
				enthusiast: false,
				risk_taker: false,
				the_strategist: false,
				big_2_champion: false,
				double_digits: false,
				century_club: false,
				hot_hand: false,
				flush_with_pride: false,
				never_folds: false,
				curious_cat: false,
				imposter: false,
				social_butterfly: false,
				connoisseur: false,
			},

			setCachedStats: async () => {
				const clientUuid = useAuthStore.getState().clientUuid;
				const members = usePartyStore.getState().members;

				const allUuids = Array.from(
					new Set([
						...members,
						...(clientUuid ? [clientUuid] : [])
					])
				).filter(
					(uuid): uuid is string => uuid !== null
				);

				const stats = await Promise.all(
					allUuids.map(async (memberUuid) => {
						const userStats = await handlePublicPlayerGameData(memberUuid);
						if (!userStats)
							return null;

						return {
							uuid: memberUuid,
							data: {
								level: userStats.stats.level,
								xp: userStats.stats.xp,
								totalPlayed: userStats.stats.totalPlayed,
								totalWins: userStats.stats.totalWins,
								winStreak: userStats.stats.winStreak,
								displayedBadgeId: userStats.stats.displayedBadgeId,
								currentLevelXpThreshold: userStats.levelProgress.currentLevelXpThreshold,
								currentLevelProgressPercentage: userStats.levelProgress.currentLevelProgressPercentage,
								achievements: userStats.achievements,
							},
						}
					})
				);

				set((state) => {
					const cachedStats = { ...state.cachedStats };
					for (const stat of stats) {
						if (!stat)
							continue;
						cachedStats[stat.uuid] = stat.data;
					}
					return {
						cachedStats,
					}
				});
			},

			removeCachedStat: (uuid) => {
				if (!uuid)
					return;

				set((state) => {
					const cachedStats = { ...state.cachedStats }
					delete cachedStats[uuid];
					return { cachedStats };
				});
			},
		}),
		{
			name: 'stats-storage',
		}
	)
);