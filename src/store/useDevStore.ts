import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DevState {
	showFrame: boolean;
	showStats: boolean;

	setShowFrame: () => void;
	setShowStats: () => void;
} 

export const useDevStore = create<DevState>()(
	persist(
		(set) => ({
			showFrame: false,
			showStats: false,
			
			setShowFrame: () => set((state) => ({ showFrame: !state.showFrame })),
			setShowStats: () => set((state) => ({ showStats: !state.showStats })),
		}),
		{
			name: "dev-storage",
		}
	)
);