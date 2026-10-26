import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AVAILABILITY_TYPE = "Offline" | "Online" | "Busy";

interface PartyValues {
	partyVerboseMode: boolean; 
	partySocketId: string | null;
	partyGameId: string | null;
	members: (string | null)[];
	hostUuid: string | null;
	availabilityOverrides: Record<string, AVAILABILITY_TYPE>;
}

interface PartyState extends PartyValues {
	kickPlayer: (uuid: string) => void;
	setAvailability: (uuid: string, availability: AVAILABILITY_TYPE) => void;
	clearAvailability: (uuid: string) => void;
	resetValues: () => void;
}

export const usePartyStore = create<PartyState>() (
	persist(
		(set, get) => ({
			partyVerboseMode: false,
			partySocketId: null,
			partyGameId: null,
			members: [],
			hostUuid: null,
			availabilityOverrides: {},

			kickPlayer: (uuid) => {
				const currentMembers = get().members;
				set({ members: currentMembers.filter((d) => d !== uuid) });
			},

			setAvailability: (uuid, availability) => {
				set((state) => ({
					availabilityOverrides: {
						...state.availabilityOverrides,
						[uuid]: availability,
					},
				}));
			},

			clearAvailability: (uuid) => {
				set((state) => {
					const overrides = { ...state.availabilityOverrides };
					delete overrides[uuid];
					return { availabilityOverrides: overrides };
				});
			},

			resetValues: () => {
				set({
					partySocketId: null,
					partyGameId: null,
					members: [],
					hostUuid: null,
					availabilityOverrides: {},
				});
			}
		}),
		{
			name: 'party-storage',
		}
	)
);