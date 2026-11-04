import { create } from "zustand";

interface DevValues {
	showFrame: boolean;
}

interface DevState extends DevValues {}

export const useDevStore = create<DevState>()(
	() => ({
		showFrame: false,
	}),
);
