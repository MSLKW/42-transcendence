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
<<<<<<< HEAD
export const autoPassKeys = Object.keys(AUTO_PASS_RECORD);
export const autoPassValues = Object.values(AUTO_PASS_RECORD);
=======
>>>>>>> origin/int/KAN-36-website-db

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
<<<<<<< HEAD
=======
	setSettingsValue: <K extends keyof SettingsValues>(key: K, value: SettingsValues[K]) => void;
>>>>>>> origin/int/KAN-36-website-db
	toggleSettingsValue: (key: 'allow3OfAKind' | 'allow2OfSpadesEnd') => void;
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

<<<<<<< HEAD
			toggleSettingsValue: (key) => { set((state) => ({ [key]: !state[key] })) },
=======
			setSettingsValue: (key, value) => set(() => ({ [key]: value })),
			toggleSettingsValue: (key) => set((state) => ({ [key]: !state[key] })),
>>>>>>> origin/int/KAN-36-website-db
		}),
		{ name: 'settings-storage' }
	)
);