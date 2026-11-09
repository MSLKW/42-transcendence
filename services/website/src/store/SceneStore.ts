import { create } from "zustand";
import { persist } from "zustand/middleware";
import { threejsManager } from "../App";

export type SCENES = "Badge" | "Login" | "Home" | "Lobby" | "Game";

export const defaultShowWindow = {
	badge: false,
	bots: false,
	chat: false,
	createAccount: false,
	disconnect: false,
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
	stale: false,
	stats: false,
} as const;

interface SceneValues {
	sceneVerboseMode: boolean;
	currentScene: SCENES;
	showWindow: Record<string, boolean>;
	playerStatsUuid: string | null;
}

interface SceneState extends SceneValues {
	setCurrentScene: (scene: SCENES) => void;
	setShowWindow: (window: string, show: boolean, uuid?: string) => void;
	resetWindows: () => void;
	resetValues: () => void;
}

export const useSceneStore = create<SceneState>() (
	persist( 
		(set, get) => ({
			sceneVerboseMode: false,
			currentScene: "Login",
			showWindow: defaultShowWindow,
			playerStatsUuid: null,

			setCurrentScene: (scene) => {
				set({ currentScene: scene });
				threejsManager?.changeScene(scene.toLowerCase());
				useSceneStore.getState().resetWindows();
			},

			setShowWindow: (window, show, uuid) => {
				const showWindow = get().showWindow;
				set({
					playerStatsUuid: uuid,
					showWindow: {
						...showWindow,
						[window]: show,
					},
				});
			},

			resetWindows: () => {
				const showWindow = get().showWindow;
				set({
					showWindow: {
						...defaultShowWindow,
						notification: showWindow.notification,
					}
				});
			},

			resetValues: () => {
				get().resetWindows();
				set({
					currentScene: "Login",
					playerStatsUuid: null,
				});
			},
		}),
		{
			name: 'scene-storage',

			partialize: (state) => ({
				sceneVerboseMode: state.sceneVerboseMode,
				currentScene: state.currentScene,
			})
		}
	)
);