import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGameStore } from "./GameStore";
<<<<<<< HEAD
import type { BADGE_TYPE } from "./ProfileStore";
import { threejsManager } from "../App";

export type SCENES = "Badge" | "Login" | "Home" | "Lobby" | "Test" | "Game";

interface SceneValues {
	currentScene: SCENES;
	showWindow: Record<string, boolean>;
	profileUuid: string | null;
}

interface SceneState extends SceneValues {
	setCurrentScene: (scene: SCENES) => void;
	setShowWindow: (window: string, show: boolean, uuid?: string | BADGE_TYPE) => void;
}

export const defaultShowWindow = {
	badge: false,
	bots: false,
	chat: false,
	createAccount: false,
	info: false,
	leave: false,
	notification: false,
	party: false,
	profile: false,
	rank: false,
	results: false,
	signIn: false,
	settings: false,
	setup: false,
	stats: false,
} as const;

export const useSceneStore = create<SceneState>() (
	persist( 
		(set, get) => ({
			currentScene: "Login",
			showWindow: defaultShowWindow,
			profileUuid: null,

			setCurrentScene: (scene) => {
				set({ currentScene: scene });
				threejsManager?.changeScene(scene.toLowerCase());
				useGameStore.setState({ gameStarted: scene === "Game" });
			},
			setShowWindow: (window, show, uuid) => {
				const showWindow = get().showWindow;
				set({
					profileUuid: uuid,
					showWindow: {
						...showWindow,
						[window]: show,
					},
				});
			},
=======

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
>>>>>>> origin/int/KAN-36-website-db
		}),
		{
			name: 'scene-storage',
		}
	)
);