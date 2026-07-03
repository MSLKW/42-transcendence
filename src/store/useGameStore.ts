import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
	activePlayer: number;
	playerList: string[];

	setActivePlayer: () => void;
	setPlayerList: () => void;
}

export const useGameStore = create<GameState>() (
	persist(
		(set) => ({
			activePlayer: 0,
			playerList: [""],

			setActivePlayer: () => set((state) => ({ activePlayer: state.activePlayer + 1})),
			setPlayerList: () => set(() => ({ playerList: [""] })),
		}),
		{
			name: 'game-session-storage',
		}
	)
);