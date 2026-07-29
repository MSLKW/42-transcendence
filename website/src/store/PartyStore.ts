import { create } from "zustand";
import { persist } from "zustand/middleware";
import { usePlayerStore, type PlayerData } from "./PlayerStore";

export const GAMEMODE = {
	NONE: 0,
	TUTORIAL: 1,
	VERSUS2: 2,
	VERSUS3: 3,
	VERSUS4: 4,
} as const;
export type GameModeType = typeof GAMEMODE[keyof typeof GAMEMODE];

export const RELATION = {
	STRANGER: 0,
	FRIEND: 1,
	SELF: 2,
	BOT: 3,
} as const;
export type RelationType = typeof RELATION[keyof typeof RELATION];

export const SEATNUMBER_UNSEATED = -1 as const;

export interface MemberData extends PlayerData {
	relation: RelationType;	//relationship of this person relative to you; stranger, friend, self, bot
	isHost: boolean;		//only 1 party member can be "host"
	seatNumber: number;		//0, 1, 2, 3, 4, 5, ...
							//if seatNumber is greater than game mode ie (4 players), members 4 and 5 are spectators

	//from host pov: <4 players game mode> [0 bottom, 1 left, 2 top, 3 right], <3 players game mode> [0 bottom, 1 left, 2 right], <2 players game mode> [0 bottom, 1 top]
	//when rendering from non-host pov, offset all active player's seat placements (modulo total players) so client is at the bottom of their own screen
}

interface PartyValues {
	totalMembers: number;	//minimum of 1. no max limit (members can be spectator and not play)
	gameMode: GameModeType;
	members: MemberData[];
}

interface PartyState extends PartyValues {
	setPartyValue: <K extends keyof PartyValues>(key: K, value: PartyValues[K]) => void;
	addMember: (member: MemberData) => void;
	removeMember: (uuid: string) => void;
	removeBots: () => void;
	toggleIsFriend: (index: number) => void;
	changeSeatNumber: (
		uuid_target: string,
		seat_target: number,
		uuid_swap?: string,
		seat_origin?: number,
	) => void;
}

export const usePartyStore = create<PartyState>() (
	persist(
		(set) => ({
			totalMembers: 1,
			gameMode: 0,
			members: [
				{
					uuid: "",
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
					seatNumber: SEATNUMBER_UNSEATED,
					isHost: true,
					relation: RELATION.SELF,
				},
			],

			setPartyValue: (key, value) => set({ [key]: value }),

			addMember: (member) => set((partyStore) => {
				const exists = partyStore.members.some((m) => m.uuid === member.uuid);
				const updatedMembers = exists
					? partyStore.members.map((m) => (m.uuid === member.uuid 
						? { ...m, ...member}
						: m
					)) : [...partyStore.members, { ...member }];
				return {
					members: updatedMembers,
					totalMembers: exists ? partyStore.totalMembers: partyStore.members.length + 1,
				};
			}),

			removeMember: (uuid) => set((partyStore) => {
				const updatedMembers = partyStore.members.filter((m) => m.uuid !== uuid);
				return {
					members: updatedMembers,
					totalMembers: Math.max(1, updatedMembers.length),
				};
			}),

			removeBots: () => set((partyStore) => {
				const humanMembers = partyStore.members.filter((m) => m.relation != RELATION.BOT);
				return {
					members: humanMembers,
					totalMembers: humanMembers.length,
				}
			}),

			toggleIsFriend: (index) => set((partyStore) => {
				const target = partyStore.members[index];
				if (!target || target.relation === RELATION.SELF || target.relation === RELATION.BOT)
					return partyStore;
				const nextRelation = target.relation === RELATION.FRIEND
					? RELATION.STRANGER
					: RELATION.FRIEND
				return {
					members: partyStore.members.map((m, i) => i === index
						? { ...m, relation: nextRelation }
						: m
					),
				};
			}),

			changeSeatNumber: (uuid_target, seat_target, uuid_swap, seat_origin) => set((partyStore) => {
				const updatedMembers = partyStore.members.map((member) => {
					if (member.uuid === uuid_target) {
						return { ...member, seatNumber: seat_target };
					}
					if (uuid_swap && member.uuid === uuid_swap) {
						return {
							...member,
							seatNumber: seat_origin ?? SEATNUMBER_UNSEATED
						};
					}
					return member;
				});
				return { members: updatedMembers };
			}),
		}),
		{
			name: 'party-storage',
		}
	)
);

const syncPlayerDataToParty = (newPlayerData: PlayerData) => {
	if (!newPlayerData)
		return;

	const partyStore = usePartyStore.getState();
	const selfMember = partyStore.members[0];
	if (!selfMember)
		return;

	const hasChanged = Object.keys(newPlayerData).some((key) => {
		const k = key as keyof PlayerData;
		return JSON.stringify(selfMember[k]) !== JSON.stringify(newPlayerData[k]);
	});

	if (hasChanged) {
		const updatedMembers = [...partyStore.members];

		updatedMembers[0] = {
			...selfMember,
			...newPlayerData,
		};

		partyStore.setPartyValue("members", updatedMembers);
	}
};

usePlayerStore.subscribe((state) => syncPlayerDataToParty(state.data));
syncPlayerDataToParty(usePlayerStore.getState().data);