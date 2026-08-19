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
				useSceneStore.setState({
					currentScene: "Login",
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
				});
			},
		}),
		{
			name: "dev-storage",
		}
	)
);