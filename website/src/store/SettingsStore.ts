import { create } from "zustand";
import { persist } from "zustand/middleware";

// interface SettingsState {
// 	allow3OfAKind: boolean;
// 	allow2OfSpadesEnd: boolean;
// 	autoPassIndex: number;
// 	autoPassText: string[];
// 	endGameCondition: number;
// 	scoreCalculation: number;
// 	cardStyle: number;
// 	uiColor: number;
// 	fxLevel: number;
// 	mxLevel: number;

// 	setAllow3OfAKind: () => void;
// 	setAllow2OfSpadesEnd: () => void;
// 	setAutoPassIndex: (index: number) => void;
// 	setEndGameCondition: (condition: number) => void;
// 	setScoreCalculation: (calculate: number) => void;
// 	setCardStyle: (style: number) => void;
// 	setUIColor: (color: number) => void;
// 	setFXLevel: (level: number) => void;
// 	setMXLevel: (level: number) => void;
// }

// export const useSettingsStore = create<SettingsState>() (
// 	persist(
// 		(set) => ({
// 			allow3OfAKind: true,
// 			allow2OfSpadesEnd: true,
// 			autoPassIndex: 6,
// 			autoPassText: ["1s", "3s", "5s", "10s", "15s", "30s", "42s", "1 min", "2 mins", "No Limit"],
// 			endGameCondition: 0,
// 			scoreCalculation: 1,
// 			cardStyle: 0,
// 			uiColor: 0,
// 			fxLevel: 75,
// 			mxLevel: 50,

// 			setAllow3OfAKind: () => set((settingStore) => ({ allow3OfAKind: !settingStore.allow3OfAKind })),
// 			setAllow2OfSpadesEnd: () => set((settingStore) => ({ allow2OfSpadesEnd: !settingStore.allow2OfSpadesEnd })),
// 			setAutoPassIndex: (index) => set({ autoPassIndex: index }),
// 			setEndGameCondition: (condition) => set({ endGameCondition: condition }),
// 			setScoreCalculation: (calculate) => set({ scoreCalculation: calculate }),
// 			setCardStyle: (style) => set({ cardStyle: style }),
// 			setUIColor: (color) => set({ uiColor: color }),
// 			setFXLevel: (level) => set({ fxLevel: level }),
// 			setMXLevel: (level) => set({ mxLevel: level }),
// 		}),
// 		{
// 			name: 'settings-session-storage',
// 		}
// 	)
// );

interface SettingsValues {
	allow3OfAKind: boolean;
	allow2OfSpadesEnd: boolean;
	autoPassIndex: number;
	autoPassText: string[];
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
			autoPassText: ["1s", "3s", "5s", "10s", "15s", "30s", "42s", "1 min", "2 mins", "No Limit"],
			endGameCondition: 0,
			scoreCalculation: 1,
			cardStyle: 0,
			uiColor: 0,
			fxLevel: 75,
			mxLevel: 50,

			setSetting: (key, value) => set(() => ({ [key]: value })),
			toggleSetting: (key) => set((state) => ({ [key]: !state[key] })),
		}),
		{ name: 'settings-session-storage' }
	)
);