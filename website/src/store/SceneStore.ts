import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGameStore } from "./GameStore";

export type SCENES = "BADGE" | "LOGIN" | "HOME" | "LOBBY" | "GAMEPLAY" | "R3F" | "RESULTS";

interface SceneValues {
	currentScene: SCENES;
	sceneHeight: number;
	sceneWidth: number;
	showWindow: Record<string, boolean>;
	profileIndex: number;
}

interface SceneState extends SceneValues {
	setSceneValue: <K extends keyof SceneValues>(key: K, value: SceneValues[K]) => void;
	setCurrentScene: (scene: SCENES) => void;
	setSceneWidth: (width: number) => void;
	setSceneHeight: (height: number) => void;
	setShowWindow: (window: string, show: boolean) => void;
} 

export const useSceneStore = create<SceneState>() (
	persist( 
		(set) => ({
			currentScene: "LOGIN",
			sceneHeight: 320,
			sceneWidth: 320,
			showWindow: {
				badge: false,
				bots: false,
				createAccount: false,
				signIn: false,
				settings: false,
				info: false,
				notification: false,
				profile: false,
				setup: false,
				stats: false,
				party: false,
				chat: false,
				rank: false,
			},
			profileIndex: 0,

			setSceneValue: (key, value) => set(() => ({ [key]: value })),
			setCurrentScene: (scene) => {
				set({ currentScene: scene });
				useGameStore.getState().setGameValue("gameStarted", scene === "R3F" || scene === "GAMEPLAY");
			},
			setSceneWidth: (sceneWidth) => set({ sceneWidth }),
			setSceneHeight: (sceneHeight) => set({ sceneHeight }),
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