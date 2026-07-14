import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
	gameMode: number;
	gameStarted: boolean;
	activePlayer: number;

	setGameMode: (mode: number) => void;
	setGameStarted: (started: boolean) => void;
	setActivePlayer: () => void;
}

export const useGameStore = create<GameState>() (
	persist(
		(set) => ({
			gameMode: 4,
			gameStarted: false,
			activePlayer: 0,

			setGameMode: (mode) => set({ gameMode: mode }),
			setGameStarted: (started) => set({ gameStarted: started }),
			setActivePlayer: () => set((state) => ({ activePlayer: state.activePlayer + 1 })),
		}),
		{
			name: 'game-storage',
		}
	)
);