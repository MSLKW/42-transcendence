import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
	gameMode: number;
	gameStarted: boolean;
	activePlayer: number;
	partyCount: number;
	playerList: string[];

	setGameMode: (mode: number) => void;
	setGameStarted: (started: boolean) => void;
	setActivePlayer: () => void;
	setPartyCount: (count: number) => void;
	setPlayerList: (list: string[]) => void;
}

export const useGameStore = create<GameState>() (
	persist(
		(set) => ({
			gameMode: 4,
			gameStarted: false,
			activePlayer: 0,
			partyCount: 1,
			playerList: ["Player", "Void", "Null", "Undefined"],

			setGameMode: (mode) => set({ gameMode: mode }),
			setGameStarted: (started) => set({ gameStarted: started }),
			setActivePlayer: () => set((state) => ({ activePlayer: state.activePlayer + 1 })),
			setPartyCount: (count) => set({ partyCount: count }),
			setPlayerList: (list) => set({ playerList: list }),
		}),
		{
			name: 'game-storage',
		}
	)
);