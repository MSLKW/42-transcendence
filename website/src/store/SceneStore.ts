import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGameStore } from "./GameStore";

export type SCENES = "BADGE" | "LOGIN" | "HOME" | "LOBBY" | "GAMEPLAY" | "R3F" | "RESULTS";

interface SceneState {
	currentScene: SCENES;
	contAreaWidth: number;
	contAreaHeight: number;
	showWindow: Record<string, boolean>;

	setCurrentScene: (scene: SCENES) => void;
	setContAreaWidth: (width: number) => void;
	setContAreaHeight: (height: number) => void;
	setShowWindow: (window: string, show: boolean) => void;
} 

export const useSceneStore = create<SceneState>() (
	persist( 
		(set) => ({
			contAreaWidth: 320,
			contAreaHeight: 320,
			currentScene: "LOGIN",
			showWindow: {
				badge: false,
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
		}),
		{
			name: 'scene-storage',
		}
	)
);