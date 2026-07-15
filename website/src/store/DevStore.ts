import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DevValues {
	showFrame: boolean;
	showStats: boolean;
}

interface DevState extends DevValues {
    toggleFlag: (key: keyof DevValues) => void;
}

export const useDevStore = create<DevState>()(
	persist(
		(set) => ({
			showFrame: false,
			showStats: false,

			toggleFlag: (key) => set((devStore) => ({ [key]: !devStore[key] })),
		}),
		{
			name: "dev-storage",
		}
	)
);