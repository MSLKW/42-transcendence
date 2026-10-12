import { create } from "zustand";
// import { persist } from "zustand/middleware";

export const AVAILABILITY_LABEL = [
	"Offline",
	"Online",
	"Busy",
] as const;
export type AVAILABILITY_TYPE = typeof AVAILABILITY_LABEL[number];

interface PartyValues {
	partySocketId: string | null;
	partyGameId: string | null;
	members: (string | null)[];
	hostUuid: string | null;
}

interface PartyState extends PartyValues {
	kickPlayer: (uuid: string) => void;
}

export const usePartyStore = create<PartyState>() (
	// persist(
		(set, get) => ({
			partySocketId: null,
			partyGameId: null,
			members: [],
			hostUuid: null,

			kickPlayer: (uuid) => {
				const currentMembers = get().members;
				set({ members: currentMembers.filter((d) => d !== uuid) });
			}
		}),
	// 	{
	// 		name: 'party-storage',
	// 	}
	// )
);