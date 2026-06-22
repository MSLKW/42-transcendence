import { create } from "zustand";

interface DevState {
	showFrame: boolean;
	showStats: boolean;

	setShowFrame: () => void;
	setShowStats: () => void;
} 

export const useDevStore = create<DevState>((set) => ({
	showFrame: false,
	showStats: false,

	setShowFrame: () => set((state) => ({ showFrame: !state.showFrame })),
	setShowStats: () => set((state) => ({ showStats: !state.showStats })),
}));