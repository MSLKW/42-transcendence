import { create } from "zustand";
import { persist } from "zustand/middleware";

export const AUTO_PASS_LABELS = ["1s", "3s", "5s", "10s", "15s", "30s", "42s", "1 min", "2 mins", "No Limit"] as const;

interface SettingsValues {
	allow3OfAKind: boolean;
	allow2OfSpadesEnd: boolean;
	autoPassIndex: number;
	endGameCondition: number;
	scoreCalculation: number;
	cardStyle: number;
	uiColor: number;
	fxLevel: number;
	mxLevel: number;
}

interface SettingsState extends SettingsValues {
	setSetting: <K extends keyof SettingsValues>(key: K, value: SettingsValues[K]) => void;
	toggleSetting: (key: 'allow3OfAKind' | 'allow2OfSpadesEnd') => void;
}

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set) => ({
			allow3OfAKind: true,
			allow2OfSpadesEnd: true,
			autoPassIndex: 6,
			endGameCondition: 0,
			scoreCalculation: 1,
			cardStyle: 0,
			uiColor: 0,
			fxLevel: 75,
			mxLevel: 50,

			setSetting: (key, value) => set(() => ({ [key]: value })),
			toggleSetting: (key) => set((state) => ({ [key]: !state[key] })),
		}),
		{ name: 'settings-storage' }
	)
);