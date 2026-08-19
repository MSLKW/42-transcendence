import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGameStore } from "./GameStore";
import type { BADGE_TYPE } from "./ProfileStore";

export type SCENES = "Badge" | "Login" | "Home" | "Lobby" | "Test" | "Game";

interface SceneValues {
	currentScene: SCENES;
	showWindow: Record<string, boolean>;
	profileUuid: string | null;
}

interface SceneState extends SceneValues {
	setSceneValue: <K extends keyof SceneValues>(key: K, value: SceneValues[K]) => void;
	setCurrentScene: (scene: SCENES) => void;
	setShowWindow: (window: string, show: boolean, uuid?: string | BADGE_TYPE) => void;
} 

export const useSceneStore = create<SceneState>() (
	persist( 
		(set) => ({
			currentScene: "Login",
			showWindow: {
				badge: false,
				bots: false,
				chat: false,
				createAccount: false,
				info: false,
				notification: false,
				party: false,
				profile: false,
				rank: false,
				results: false,
				signIn: false,
				settings: false,
				setup: false,
				stats: false,
			},
			profileUuid: null,

			setSceneValue: (key, value) => {
				set({
					[key]: value
				});
			},
			setCurrentScene: (scene) => {
				set({
					currentScene: scene
				});
				useGameStore.setState({
					gameStarted: scene === "Game",
				});
			},
			setShowWindow: (window, show) => set((sceneStore) => {
				return {
					showWindow: {
						...sceneStore.showWindow,
						[window]: show,
					}
				}
			}),
		}),
		{
			name: 'scene-storage',
		}
	)
);