import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGameStore } from "./GameStore";
import type { BADGE_TYPE } from "./ProfileStore";
import { threejsManager } from "../App";

export type SCENES = "Badge" | "Login" | "Home" | "Lobby" | "Test" | "Game";

interface SceneValues {
	currentScene: SCENES;
	showWindow: Record<string, boolean>;
	statsUuid: string | null;
}

interface SceneState extends SceneValues {
	setCurrentScene: (scene: SCENES) => void;
	setShowWindow: (window: string, show: boolean, uuid?: string | BADGE_TYPE) => void;
	resetWindows: () => void;
	resetValues: () =>void
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
			statsUuid: null,

			setCurrentScene: (scene) => {
				set({ currentScene: scene });
				threejsManager?.changeScene(scene.toLowerCase());
				useGameStore.setState({ gameStarted: scene === "Game" });
			},

			setShowWindow: (window, show, uuid) => {
				const showWindow = get().showWindow;
				set({
					statsUuid: uuid,
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
						chat: showWindow.chat,
					}
				});
			},

			resetValues: () => {
				get().resetWindows();
				set({
					currentScene: "Login",
					statsUuid: null,
				});
			},
		}),
		{
			name: 'scene-storage',
		}
	)
);