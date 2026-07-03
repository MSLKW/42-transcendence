import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
	activePlayer: number;

	setActivePlayer: () => void;
}

export const useGameStore = create<GameState>() (
	persist(
		(set) => ({
			activePlayer: 0,

			setActivePlayer: () => set((state) => ({ activePlayer: state.activePlayer + 1})),
		}),
		{
			name: 'game-session-storage',
		}
	)
);