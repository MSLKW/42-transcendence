import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
	gameStarted: boolean;
	activePlayer: number;
	partyCount: number;
	playerList: string[];
	allowThrees: boolean;
	allow2SpadesFinish: boolean;
	autoPassIndex: number;
	gameEndCondition: number;
	scoreCalculation: number;
	pCardLook: number;
	uiColors: number;
	fxLevel: number;
	mxLevel: number;

	setGameStarted: (started: boolean) => void;
	setActivePlayer: () => void;
	setPartyCount: (count: number) => void;
	setPlayerList: (list: string[]) => void;
	setAllowThrees: () => void;
	setAllow2SpadesFinish: () => void;
	setAutoPassIndex: (index: number) => void;
	setGameEndCondition: (condition: number) => void;
	setScoreCalculation: (calculate: number) => void;
	setPCardLook: (look: number) => void;
	setUIColors: (colors: number) => void;
	setFXLevel: (level: number) => void;
	setMXLevel: (level: number) => void;
}

export const useGameStore = create<GameState>() (
	persist(
		(set) => ({
			gameStarted: false,
			activePlayer: 0,
			partyCount: 1,
			playerList: ["Player", "Void", "Null", "Undefined"],
			allowThrees: true,
			allow2SpadesFinish: true,
			autoPassIndex: 6,
			gameEndCondition: 0,
			scoreCalculation: 1,
			pCardLook: 0,
			uiColors: 0,
			fxLevel: 75,
			mxLevel: 50,

			setGameStarted: (started) => set({ gameStarted: started }),
			setActivePlayer: () => set((state) => ({ activePlayer: state.activePlayer + 1 })),
			setPartyCount: (count) => set({ partyCount: count }),
			setPlayerList: (list) => set({ playerList: list }),
			setAllowThrees: () => set((state) => ({ allowThrees: !state.allowThrees })),
			setAllow2SpadesFinish: () => set((state) => ({ allow2SpadesFinish: !state.allow2SpadesFinish })),
			setAutoPassIndex: (index) => set({ autoPassIndex: index }),
			setGameEndCondition: (condition) => set({ gameEndCondition: condition }),
			setScoreCalculation: (calculate) => set({ scoreCalculation: calculate }),
			setPCardLook: (look) => set({ pCardLook: look }),
			setUIColors: (colors) => set({ uiColors: colors }),
			setFXLevel: (level) => set({ fxLevel: level }),
			setMXLevel: (level) => set({ mxLevel: level }),
		}),
		{
			name: 'game-session-storage',
		}
	)
);