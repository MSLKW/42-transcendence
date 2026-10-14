import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DevValues {
	showDevSection: boolean;
	showFrame: boolean;
	showStats: boolean;
}

interface DevState extends DevValues {}

export const useDevStore = create<DevState>()(
	persist(
		(_set) => ({
			showDevSection: true,
			showFrame: false,
			showStats: false,
		}),
		{
			name: "dev-storage",
		}
	)
);