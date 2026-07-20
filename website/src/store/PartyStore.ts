import { create } from "zustand";
import { persist } from "zustand/middleware";
import { usePlayerStore, type PlayerData } from "./PlayerStore";

export const ISFRIEND = {
	NA: -1, //self or bot
	FALSE: 0,
	TRUE: 1,
} as const;

export interface MemberData extends PlayerData {
	isFriend: number;
	isHost: boolean;			//only 1 party member can be "host"
}

interface PartyValues {
	partyCount: number;			//minimum of 1. no max limit (members can be spectator and not play)
	playerFocus: number;
	members: MemberData[];
}

interface PartyState extends PartyValues {
	setPartyValue: <K extends keyof PartyValues>(key: K, value: PartyValues[K]) => void;
	addMember: (member: MemberData) => void;
	removeMember: (member: MemberData) => void;
	setIsFriend: (name: string, friendStatus: number) => void;
}

export const usePartyStore = create<PartyState>() (
	persist(
		(set) => ({
			partyCount: 1,
			playerFocus: 0,
			members: [
				{
					uuid: "12345678-abcd-efgh-ijkl-000000000000",
					name: null,
					avatar: "avatar-stock-0.webp",
					badge: "Newcomer",
					level: 1,
					xp: 0,
					createdAt: "15 July 2026",
					lastLogin: "15 July 2026",
					totalPlayed: 0,
					totalWins: 0,
					totalLoss: 0,
					winStreak: 0,
					achievements: {
						FIRST_LOGIN: null,
						LOGIN_1_WEEK: null,
						PLAYED_1_GAME: null,
						PLAYED_10_GAMES: null,
						PLAYED_42_GAMES: null,
						FIRST_WIN: null,
						WIN_STREAK_2: null,
						WIN_STREAK_5: null,
						WIN_STREAK_10: null,
						MASTER_COLLECTOR: null,
					},
					seatNumber: -1,
					isHost: true,
					isFriend: ISFRIEND.NA,
				},
			],

			setPartyValue: (key, value) => set(() => ({ [key]: value })),
			addMember: (member) => set((partyStore) => {
				const exists = partyStore.members.some((m) => m.name === member.name);
				return {
					members: exists
						? partyStore.members.map((m) => m.name === member.name ? { ...m, ...member } : m)
						: [...partyStore.members, { ...member, isFriend: ISFRIEND.FALSE }],
					partyCount: partyStore.partyCount + 1,
				};
			}),
			removeMember: (member) => set((partyStore) => ({
					members: partyStore.members.filter((m) => m.name !== member.name),
					partyCount: Math.max(1, partyStore.partyCount - 1),
			})),
			setIsFriend: (memberName, friendStatus) => set((partyStore) => ({
				members: partyStore.members.map((m) =>
					m.name === memberName ? { ...m, isFriend: friendStatus } : m
				)
			})),
		}),
		{
			name: 'party-storage',
		}
	)
);

const syncPlayerDataToParty = (newPlayerData: PlayerData) => {
	const partyStore = usePartyStore.getState();
	const currentMembers = [...partyStore.members];

	if (currentMembers[0]) {
		const { isFriend, isHost, ...existingPlayerData } = currentMembers[0];

		if (JSON.stringify(existingPlayerData) === JSON.stringify(newPlayerData))
			return;

		currentMembers[0] = {
			...currentMembers[0],
			...newPlayerData
		};

		partyStore.setPartyValue("members", currentMembers);
	}
};

usePlayerStore.subscribe((state) => syncPlayerDataToParty(state.data));
syncPlayerDataToParty(usePlayerStore.getState().data);