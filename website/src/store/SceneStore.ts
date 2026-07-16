import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGameStore } from "./GameStore";
import { usePartyStore, ISFRIEND } from "./PartyStore";
import { usePlayerStore, STATUS, SEATNUMBER_UNSEATED } from "./PlayerStore";

export type SCENES = "LOGIN" | "HOME" | "LOBBY" | "GAMEPLAY" | "R3F" | "RESULTS";

interface SceneState {
	currentScene: SCENES;
	contAreaWidth: number;
	contAreaHeight: number;
	showWindow: Record<string, boolean>;
	playerStatsFocus: number;

	setCurrentScene: (scene: SCENES) => void;
	resetGame: () => void;
	setContAreaWidth: (width: number) => void;
	setContAreaHeight: (height: number) => void;
	setShowWindow: (window: string, show: boolean) => void;
	setPlayerStatsFocus: (player: number) => void;
} 

export const useSceneStore = create<SceneState>() (
	persist( 
		(set) => ({
			contAreaWidth: 320,
			contAreaHeight: 320,
			currentScene: "LOGIN",
			showWindow: {
				createAccount: false,
				signIn: false,
				settings: false,
				info: false,
				profile: false,
				stats: false,
				party: false,
				chat: false,
				rank: false,
			},
			playerStatsFocus: 0,

			setContAreaWidth: (contAreaWidth) => set({ contAreaWidth }),
			setContAreaHeight: (contAreaHeight) => set({ contAreaHeight }),
			setCurrentScene: (scene) => {
				set({ currentScene: scene });
				useGameStore.getState().setGameValue("gameStarted", scene === "R3F" || scene === "GAMEPLAY");
			},
			setShowWindow: (window, show) => set((state) => ({ 
				showWindow: {
					...state.showWindow,
					[window]: show,
				}
			})),
			resetGame: () => {
				set({ currentScene: "LOGIN" });
				usePartyStore.setState({
					partyCount: 1,
					members: [{
						name: "Player",
						avatar: "avatar-stock-0.webp",
						badge: "Newcomer",
						level: 1,
						xp: 0,
						createdAt: new Date(1784110862000).toISOString(),
						lastLogin: new Date().toISOString(),
						totalPlayed: 0,
						totalWins: 0,
						totalLoss: 0,
						winStreak: 0,
						achievements: {
							FIRST_LOGIN: null,
							LOGIN_1_WEEK: null,
							PLAYED_1_GAME: null,
							PLAYED_10_GAMES: null,
							PLAYED_42_GAMES: null,
							FIRST_WIN: null,
							WIN_STREAK_2: null,
							WIN_STREAK_5: null,
							WIN_STREAK_10: null,
							MASTER_COLLECTOR: null,
						},
						isSeated: false,
						seatNumber: SEATNUMBER_UNSEATED,
						isHost: true,
						isFriend: ISFRIEND.NA,
					}],
				});
				usePlayerStore.setState({
					data: {
						name: "Player",
						avatar: "avatar-stock-0.webp",
						badge: "Newcomer",
						level: 1,
						xp: 0,
						createdAt: "15 July 2026",
						lastLogin: "15 July 2026",
						totalPlayed: 0,
						totalWins: 0,
						totalLoss: 0,
						winStreak: 0,
						achievements: {
							FIRST_LOGIN: null,
							LOGIN_1_WEEK: null,
							PLAYED_1_GAME: null,
							PLAYED_10_GAMES: null,
							PLAYED_42_GAMES: null,
							FIRST_WIN: null,
							WIN_STREAK_2: null,
							WIN_STREAK_5: null,
							WIN_STREAK_10: null,
							MASTER_COLLECTOR: null,
						},
						isSeated: false,
						seatNumber: -1,
					},
					status: STATUS.AVAILABLE,
				});
			},
			setPlayerStatsFocus: (player) => set({ playerStatsFocus: player }),
		}),
		{
			name: 'scene-storage',
		}
	)
);