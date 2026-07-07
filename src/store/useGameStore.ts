import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
	gameStarted: boolean;
	activePlayer: number;
	playerList: string[];

	setGameStarted: (started: boolean) => void;
	setActivePlayer: () => void;
	setPlayerList: () => void;
}

export const useGameStore = create<GameState>() (
	persist(
		(set) => ({
			gameStarted: false,
			activePlayer: 0,
			playerList: [""],

			setGameStarted: (started) => set({ gameStarted: started }),
			setActivePlayer: () => set((state) => ({ activePlayer: state.activePlayer + 1 })),
			setPlayerList: () => set(() => ({ playerList: [""] })),
		}),
		{
			name: 'game-session-storage',
		}
	)
);