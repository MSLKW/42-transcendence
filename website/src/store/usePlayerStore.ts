import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AchievementId = 
	| "FIRST_LOGIN"
	| "LOGIN_1_WEEK"
	| "PLAYED_1_GAME"
	| "PLAYED_10_GAMES"
	| "PLAYED_42_GAMES"
	| "FIRST_WIN"
	| "WIN_STREAK_2"
	| "WIN_STREAK_5"
	| "WIN_STREAK_10"
	| "MASTER_COLLECTOR"
	;

interface PlayerState {
	playerName: string;
	playerAvatar: string;
	totalPlayed: number;
	totalWins: number;
	winStreak: number;
	achievements: Record<AchievementId, { unlockedAt: number } | null>;
	playerIndex: number;

	setPlayerName: (name: string) => void;
	setPlayerAvatar: (avatar: string) => void;
	incTotalPlayed: () => void;
	incTotalWins: () => void;
	incWinStreak: () => void;
	resetWinStreak: () => void;
	unlockAchievement: (id: AchievementId) => void;
	setPlayerIndex: (index: number) => void;
}

export const usePlayerStore = create<PlayerState>() (
	persist(
		(set) => ({
			playerName: "",
			playerAvatar: "",
			totalPlayed: 0,
			totalWins: 0,
			winStreak: 0,
			achievements: {
				FIRST_LOGIN: null,
				LOGIN_1_WEEK: null,
				PLAYED_1_GAME: null,
				PLAYED_10_GAMES: null,
				PLAYED_42_GAMES: null,
				FIRST_WIN: null,
				WIN_STREAK_2: null,
				WIN_STREAK_5: null,
				WIN_STREAK_10: null,
				MASTER_COLLECTOR: null,
			},
			playerIndex: 0,

			setPlayerName: (name) => set({ playerName: name }),
			setPlayerAvatar: (avatar) => set({ playerAvatar: avatar }),
			incTotalPlayed: () => set((state) => ({ totalPlayed: state.totalPlayed + 1 })),
			incTotalWins: () => set((state) => ({ totalWins: state.totalWins + 1 })),
			incWinStreak: () => set((state) => ({ winStreak: state.winStreak + 1 })),
			resetWinStreak: () => set({ winStreak: 0 }),
			unlockAchievement: (id) => set((state) => {
				if (state.achievements[id])
					return {};
				return {
					achievements: {
						...state.achievements,
						[id]: { unlockedAt: Date.now() }
					}
				};
			}),
			setPlayerIndex: (index) => set({ playerIndex: index }),
		}),
		{
			name: 'player-storage',
		}
	)
);

