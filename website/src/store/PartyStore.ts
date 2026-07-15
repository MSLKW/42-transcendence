import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlayerData } from "./PlayerStore";

export const ISFRIEND_NA = -1; //self or bot
export const ISFRIEND_FALSE = 0;
export const ISFRIEND_TRUE = 1;

export interface MemberData extends PlayerData {
	isFriend: number;
}

interface PartyValues {
	partyCount: number;			//minimum of 1. no max limit (members can be spectator and not play)
	isHost: boolean;			//only 1 party member can be "host"
	membersData: MemberData[];
}

interface PartyState extends PartyValues {
	setPartyValue: <K extends keyof PartyValues>(key: K, value: PartyValues[K]) => void;
	setMemberData: (data: PlayerData) => void;
	setIsFriend: (name: string, friendStatus: number) => void;
}

export const usePartyStore = create<PartyState>() (
	persist(
		(set) => ({
			partyCount: 1,
			isHost: true,
			membersData: [
				{
					name: "Player",
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
					isSeated: false,
					seatNumber: -1,
					isFriend: ISFRIEND_NA,
				},
				{
					name: "Void",
					avatar: "avatar-stock-1.webp",
					badge: "Beginner's Luck",
					level: 2,
					xp: 2000,
					createdAt: "2 July 2026",
					lastLogin: "15 July 2026",
					totalPlayed: 11,
					totalWins: 6,
					totalLoss: 5,
					winStreak: 1,
					achievements: {
						FIRST_LOGIN: null,
						LOGIN_1_WEEK: null,
						PLAYED_1_GAME: null,
						PLAYED_10_GAMES: { unlockedAt: 1784110862000 },
						PLAYED_42_GAMES: { unlockedAt: 1784110862000 },
						FIRST_WIN: { unlockedAt: 1784110862000 },
						WIN_STREAK_2: { unlockedAt: 1784110862000 },
						WIN_STREAK_5: null,
						WIN_STREAK_10: null,
						MASTER_COLLECTOR: null,
					},
					isSeated: false,
					seatNumber: -1,
					isFriend: ISFRIEND_TRUE,
				},
				{
					name: "Null",
					avatar: "avatar-stock-2.webp",
					badge: "Enthusiast",
					level: 3,
					xp: 3000,
					createdAt: "3 July 2026",
					lastLogin: "15 July 2026",
					totalPlayed: 22,
					totalWins: 12,
					totalLoss: 6,
					winStreak: 6,
					achievements: {
						FIRST_LOGIN: null,
						LOGIN_1_WEEK: { unlockedAt: 1784110862000 },
						PLAYED_1_GAME: null,
						PLAYED_10_GAMES: { unlockedAt: 1784110862000 },
						PLAYED_42_GAMES: null,
						FIRST_WIN: { unlockedAt: 1784110862000 },
						WIN_STREAK_2: null,
						WIN_STREAK_5: { unlockedAt: 1784110862000 },
						WIN_STREAK_10: null,
						MASTER_COLLECTOR: { unlockedAt: 1784110862000 },
					},
					isSeated: false,
					seatNumber: -1,
					isFriend: ISFRIEND_FALSE,
				},
				{
					name: "Undefined",
					avatar: "avatar-stock-3.webp",
					badge: "Big 2 Champion",
					level: 4,
					xp: 4000,
					createdAt: "4 July 2026",
					lastLogin: "15 July 2026",
					totalPlayed: 23,
					totalWins: 7,
					totalLoss: 6,
					winStreak: 3,
					achievements: {
						FIRST_LOGIN: { unlockedAt: 1784110862000 },
						LOGIN_1_WEEK: null,
						PLAYED_1_GAME: { unlockedAt: 1784110862000 },
						PLAYED_10_GAMES: null,
						PLAYED_42_GAMES: { unlockedAt: 1784110862000 },
						FIRST_WIN: null,
						WIN_STREAK_2: { unlockedAt: 1784110862000 },
						WIN_STREAK_5: null,
						WIN_STREAK_10: { unlockedAt: 1784110862000 },
						MASTER_COLLECTOR: null,
					},
					isSeated: false,
					seatNumber: -1,
					isFriend: ISFRIEND_FALSE,
				}
			],

			setPartyValue: (key, value) => set(() => ({ [key]: value })),
			setMemberData: (data) => set((partyStore) => {
				const exists = partyStore.membersData.some((m) => m.name === data.name);
				return {
					membersData: exists
						? partyStore.membersData.map((m) => m.name === data.name ? { ...m, ...data } : m)
						: [...partyStore.membersData, { ...data, isFriend: ISFRIEND_FALSE }]
				};
			}),
			setIsFriend: (memberName, friendStatus) => set((partyStore) => ({
				membersData: partyStore.membersData.map((m) =>
					m.name === memberName ? { ...m, isFriend: friendStatus } : m
				)
			})),
		}),
		{
			name: 'party-storage',
		}
	)
);