import { create } from "zustand";
import { persist } from "zustand/middleware";
import { usePlayerStore } from "./usePlayerStore";

export type GameScene = "LOGIN" | "HOME" | "LOBBY" | "GAMEPLAY" | "R3F" | "RESULTS";

interface SceneState {
	currentScene: GameScene;
	contAreaWidth: number;
	contAreaHeight: number;

	setCurrentScene: (scene: GameScene) => void;
	resetGame: () => void;
	setContAreaWidth: (width: number) => void;
	setContAreaHeight: (height: number) => void;
} 

export const useSceneStore = create<SceneState>() (
	persist( 
		(set) => ({
			currentScene: "LOGIN",
			contAreaWidth: 320,
			contAreaHeight: 320,

			setCurrentScene: (scene) => set({ currentScene: scene }),
			resetGame: () => {
				set({ currentScene: "LOGIN" });
				usePlayerStore.setState({
					playerName: "",
					playerAvatar: "",
					totalPlayed: 0,
					totalWins: 0,
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
				});
			},
			setContAreaWidth: (contAreaWidth) => set({ contAreaWidth }),
			setContAreaHeight: (contAreaHeight) => set({ contAreaHeight }),
		}),
		{
			name: 'scene-session-storage',
		}
	)
);