import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSceneStore } from "./SceneStore";

interface DevValues {
	showDevSection: boolean;
	showFrame: boolean;
	showStats: boolean;
}

interface DevState extends DevValues {
	toggleFlag: (key: keyof DevValues) => void;
	resetGame: () => void;
}

export const useDevStore = create<DevState>()(
	persist(
		(set) => ({
			showDevSection: true,
			showFrame: false,
			showStats: false,

			toggleFlag: (key) => set((devStore) => ({ [key]: !devStore[key] })),
			resetGame: () => {
				useSceneStore.getState().resetWindows();
				useSceneStore.getState().setCurrentScene("Login");
			},
		}),
		{
			name: "dev-storage",
		}
	)
);