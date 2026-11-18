import { create } from "zustand";
import { persist } from "zustand/middleware";
import { gameInstance } from "../api/game/main";
import { type GameSettingsTransmit, autoPassValues } from "@big2/game-types";
import { fetchPutSettings } from "../api/profile/put_settings/fetchPutSettings";

export interface SettingsValues {
	allow3OfAKind: boolean;
	allow2OfSpadesEnd: boolean;
	autoPassIndex: number;
}

interface SettingsState extends SettingsValues {
	toggleSettingsValue: (key: 'allow3OfAKind' | 'allow2OfSpadesEnd') => void;
	resetValues: () => void;
	save: () => void;
	update: (gameSettings: GameSettingsTransmit) => void;
}

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set, get) => ({
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
			},

			save: () => {
				if (gameInstance) {
					const gameSettings: GameSettingsTransmit = {
						allow3OfAKind: get().allow3OfAKind,
						allow2OfSpadesEnd: get().allow2OfSpadesEnd,
						autoPassInMilliseconds: autoPassValues[get().autoPassIndex],
					};
					gameInstance.setGameSettings(gameSettings);
				}
				const settingsValues: SettingsValues = {
					allow3OfAKind: get().allow3OfAKind,
					allow2OfSpadesEnd: get().allow2OfSpadesEnd,
					autoPassIndex: get().autoPassIndex,
				}
				fetchPutSettings(settingsValues);
			},

			update: (gameSettings: GameSettingsTransmit) => {
				const passIndex = autoPassValues.findIndex((autoPassInMilliseconds) => autoPassInMilliseconds === gameSettings.autoPassInMilliseconds);
				set({
					allow3OfAKind: gameSettings.allow3OfAKind,
					allow2OfSpadesEnd: gameSettings.allow2OfSpadesEnd,
					autoPassIndex: passIndex
				});
			}
		}),
		{
			name: 'settings-storage',
		
			partialize: (state) => ({
				allow3OfAKind: state.allow3OfAKind,
				allow2OfSpadesEnd: state.allow2OfSpadesEnd,
				autoPassIndex: state.autoPassIndex,
			}),
		}
	)
);