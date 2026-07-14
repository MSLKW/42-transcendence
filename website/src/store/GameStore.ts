import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameValues {
	totalPlayers: number;
	playerOrder: string[];
	isReadyToPlay: boolean[];
	gameStarted: boolean;
	activePlayer: number;
}

interface GameState extends GameValues {
	setGameValue: <K extends keyof GameValues>(key: K, value: GameValues[K]) => void;
	setActivePlayer: () => void;
	resetActivePlayer: () => void;
}

export const useGameStore = create<GameState>() (
	persist(
		(set) => ({
			totalPlayers: 4,
			playerOrder: ["Player", "Void", "Null", "Undefined"],
			isReadyToPlay: [false, false, false, false],
			gameStarted: false,
			activePlayer: 0,

			setGameValue: (key, value) => set(() => ({ [key]: value })),
			setActivePlayer: () => set((state) => ({ activePlayer: (state.activePlayer + 1) % state.totalPlayers })),
			resetActivePlayer: () => set({ activePlayer: 0 }),
		}),
		{
			name: 'game-storage',
		}
	)
);