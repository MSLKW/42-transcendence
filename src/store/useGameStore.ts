import { create } from "zustand";

export type GameScene = "LOGIN" | "HOME" | "LOBBY" | "GAMEPLAY" | "R3F" | "RESULTS";

interface GameState {
	currentScene: GameScene;
	playerName: string;
	playerAvatar: string;
	totalPlayed: number;
	totalWins: number;
	winStreak: number;
	achievements: number[];

	setScene: (scene: GameScene) => void;
	setPlayerName: (name: string) => void;
	setPlayerAvatar: (avatar: string) => void;
	incTotalPlayed: () => void;
	incTotalWins: () => void;
	incWinStreak: () => void;
	resetWinStreak: () => void;
	unlockAchievement: (which: number) => void;
	resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
	currentScene: "LOGIN",
	playerName: "",
	playerAvatar: "",
	totalPlayed: 0,
	totalWins: 0,
	winStreak: 0,
	achievements: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

	setScene: (scene) => set({ currentScene: scene }),
	setPlayerName: (name) => set({ playerName: name }),
	setPlayerAvatar: (avatar) => set({ playerAvatar: avatar }),
	incTotalPlayed: () => set((state) => ({ totalPlayed: state.totalPlayed + 1 })),
	incTotalWins: () => set((state) => ({ totalWins: state.totalWins + 1 })),
	incWinStreak: () => set((state) => ({ winStreak: state.winStreak + 1 })),
	resetWinStreak: () => set({ winStreak: 0 }),
	unlockAchievement: (which) => set((state) => {
		const nextAchievements = [...state.achievements];
		if (which >= 0 && which < nextAchievements.length)
			nextAchievements[which] = 1;
		return { achievements: nextAchievements };
	}),
	resetGame: () => set({
		playerName: "",
		playerAvatar: "",
		totalPlayed: 0,
		totalWins: 0,
		winStreak: 0,
		achievements: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		currentScene: "LOGIN",
	}),
}));