import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useProfileStore } from "./ProfileStore";

export const RELATION_LABEL = [
	"Stranger",
	"Friend",
	"Bot",
	"Self",
] as const;
export type RELATION_TYPE = typeof RELATION_LABEL[number];

export interface MemberData {
	uuid: string | null,
	name: string | null,
	avatar: string | null,
	relation: RELATION_TYPE,
};

interface PartyValues {
	partySocketId: string | null;
	partyGameId: string | null;
	members: MemberData[];
	hostUuid: string | null;
};

interface PartyState extends PartyValues {
	setPartyValue: <K extends keyof PartyValues>(key: K, value:PartyValues[K]) => void;
	resetMembers: () => void,
	getMemberData: (memberUuid: string | null) => MemberData | undefined,
	setPartySocketId: (id: string | undefined) => void,
	setPartyData: (memberUuids: string[]) => void,
	set1PlayerParty: () => void,
};

export const usePartyStore = create<PartyState>() (
	persist(
		(set, get) => ({
			partySocketId: null,
			partyGameId: null,
			members: [],
			hostUuid: null,

			setPartyValue: (key, value) => set(() => ({ [key]: value })),
			
			resetMembers: () => set({
				members: [],
			}),
			
			getMemberData: (memberUuid) => {
				if (!memberUuid)
					return;
				const members = get().members;
				return members.find(p => p.uuid === memberUuid);
			},
			
			setPartySocketId: (id) => set({ partySocketId: id }),
			
			setPartyData: (memberUuids) => {
				const { clientUuid, getProfileData } = useProfileStore.getState();
				const newMembers: MemberData[] = memberUuids.map((uuid) => {
					if (uuid === clientUuid) {
						const data = getProfileData(uuid);
						return {
							uuid: uuid,
							name: data?.name ?? "Client",
							avatar: data?.avatar ?? "stock-0.png",
							relation: "Self",
						};
					}

					return {
						uuid: uuid,
						name: "Player",
						avatar: "stock-0.png",
						relation: "Stranger"
					};
				});
				set({ members: newMembers });
			},

			set1PlayerParty: () => {
				const clientUuid = useProfileStore.getState().clientUuid;
				if (!clientUuid)
					return;
				
				const data = useProfileStore.getState().getProfileData(clientUuid);
				if (!data)
					return;

				set({
					members: [
						{
							uuid: clientUuid,
							name: data.name,
							avatar: data.avatar,
							relation: "Self",
						}
					],
					hostUuid: clientUuid,
				});
			},
		}),
		{
			name: 'party-storage',
		}
	)
);