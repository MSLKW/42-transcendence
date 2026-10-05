import { create } from "zustand";
import { persist } from "zustand/middleware";

export const AUTO_PASS_RECORD = {
	"1s": 1000,
	"3s": 3000,
	"5s": 5000,
	"10s": 10000,
	"15s": 15000,
	"30s": 30000,
	"42s": 42000,
	"1 min": 60000,
	"2 mins": 120000,
	"No Limit": -1,
} as const;
export const autoPassKeys = Object.keys(AUTO_PASS_RECORD);
export const autoPassValues = Object.values(AUTO_PASS_RECORD);

export interface SettingsValues {
	allow3OfAKind: boolean;
	allow2OfSpadesEnd: boolean;
	autoPassIndex: number;
}

interface SettingsState extends SettingsValues {
	toggleSettingsValue: (key: 'allow3OfAKind' | 'allow2OfSpadesEnd') => void;
	resetValues: () => void;
}

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set) => ({
			allow3OfAKind: true,
			allow2OfSpadesEnd: true,
			autoPassIndex: 6,

			toggleSettingsValue: (key) => { set((state) => ({ [key]: !state[key] })) },

			resetValues: () => {
				set({
					allow3OfAKind: true,
					allow2OfSpadesEnd: true,
					autoPassIndex: 6,
				});
			}
		}),
		{ name: 'settings-storage' }
	)
);