import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
	gameStarted: boolean;
	activePlayer: number;
	playerList: string[];
	allowThrees: boolean;
	allow2SpadesFinish: boolean;
	autoPassValue: number;
	autoPassText: string[];
	gameEndCondition: number;
	scoreCalculation: number;
	pCardLook: number;
	uiColors: number;
	fxLevel: number;
	mxLevel: number;

	setGameStarted: (started: boolean) => void;
	setActivePlayer: () => void;
	setPlayerList: () => void;
	setAllowThrees: () => void;
	setAllow2SpadesFinish: () => void;
	setAutoPassValue: (value: number) => void;
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
			playerList: [""],
			allowThrees: true,
			allow2SpadesFinish: true,
			autoPassValue: 6,
			autoPassText: ["1s", "3s", "5s", "10s", "15s", "30s", "42s", "1 min", "2 mins", "No Limit"],
			gameEndCondition: 0,
			scoreCalculation: 1,
			pCardLook: 0,
			uiColors: 0,
			fxLevel: 75,
			mxLevel: 50,

			setGameStarted: (started) => set({ gameStarted: started }),
			setActivePlayer: () => set((state) => ({ activePlayer: state.activePlayer + 1 })),
			setPlayerList: () => set(() => ({ playerList: [""] })),
			setAllowThrees: () => set((state) => ({ allowThrees: !state.allowThrees })),
			setAllow2SpadesFinish: () => set((state) => ({ allow2SpadesFinish: !state.allow2SpadesFinish })),
			setAutoPassValue: (value) => set({ autoPassValue: value }),
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