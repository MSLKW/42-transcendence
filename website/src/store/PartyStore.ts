import { create } from "zustand";
import { persist } from "zustand/middleware";

type TEST_TYPE = {
	hostUuid: string;
	members: string[];
	gameId: string | null;
}

interface PartyValues {
	partySocketId: string | null;
	partyGameId: string | null;
	members: (string | null)[];
	hostUuid: string | null;
	partyStateResponse: TEST_TYPE | undefined;
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
			partyStateResponse: undefined,

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