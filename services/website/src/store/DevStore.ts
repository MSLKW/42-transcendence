import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DevValues {
	showFrame: boolean;
	showStats: boolean;
}

interface DevState extends DevValues {}

export const useDevStore = create<DevState>()(
	persist(
		(_set) => ({
			showFrame: false,
			showStats: false,
		}),
		{
			name: "dev-storage",
		}
	)
);
