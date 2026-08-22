import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PartyValues {
	partySocketId: string | null;
	partyGameId: string | null;
	members: (string | null)[];
	hostUuid: string | null;
}

interface PartyState extends PartyValues {
	kickMember: (uuid: string) => void;
}

export const usePartyStore = create<PartyState>() (
	persist(
		(set, get) => ({
			partySocketId: null,
			partyGameId: null,
			members: [],
			hostUuid: null,

			kickMember: (uuid) => {
				const currentMembers = get().members;
				set({ members: currentMembers.filter((d) => d !== uuid) });
			}
		}),
		{
			name: 'party-storage',
		}
	)
);