import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameValues {
	totalPlayers: number;
	playerNames: (string | null)[];
	isReadyToPlay: boolean[];
	gameStarted: boolean;
	activePlayer: number;
}

interface GameState extends GameValues {
	setGameValue: <K extends keyof GameValues>(key: K, value: GameValues[K]) => void;
	setActivePlayer: () => void;
}

export const useGameStore = create<GameState>() (
	persist(
		(set) => ({
			totalPlayers: 1,
			playerNames: [null],
			isReadyToPlay: [false],
			gameStarted: false,
			activePlayer: 0,

			setGameValue: (key, value) => set(() => ({ [key]: value })),
			setActivePlayer: () => set((state) => ({
				activePlayer: (state.activePlayer + 1) % state.totalPlayers
			})),
		}),
		{
			name: 'game-storage',
		}
	)
);