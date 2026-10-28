import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./AuthStore";
import { usePartyStore } from "./PartyStore";
import { handlePublicPlayerGameData } from "../api/stats/get_public-player-game-data/handlePublicPlayerGameData";

export const BADGE_LABEL = [
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
] as const;
export type BADGE_TYPE = typeof BADGE_LABEL[number];

export const ACHIEVEMENTS_LABEL = [
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
export type ACHIEVEMENTS_TYPE = typeof ACHIEVEMENTS_LABEL[number];

export interface CachedStat {
	level: number;
	xp: number;
	totalPlayed: number;
	totalWins: number;
	winStreak: number;
	displayedBadgeId: BADGE_TYPE;
	currentLevelXpThreshold: number;
	currentLevelProgressPercentage: number;
	achievements: Record<ACHIEVEMENTS_TYPE, Date | null>;
}

interface StatsValues {
	statsVerboseMode: boolean;
	isStatsLoaded: boolean;
	cachedStats: Record<string, CachedStat>;
	cachedBadges: Record<BADGE_TYPE, boolean>;
};

interface StatsState extends StatsValues {
	setCachedStats: () => Promise<void>;
	removeCachedStat: (uuid: string | null) => void;
};

export const useStatsStore = create<StatsState>() (
	persist(
		(set, _get) => ({
			statsVerboseMode: false,
			isStatsLoaded: false,
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
				hot_hand: false
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
								achievements: userStats.badges,
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
						isStatsLoaded: true,
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