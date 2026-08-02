import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlayerData } from "./PlayerStore";

export const RELATION = {
	STRANGER: 0,
	FRIEND: 1,
	SELF: 2,
	BOT: 3,
} as const;
export type RelationType = typeof RELATION[keyof typeof RELATION];

export interface PersonData extends PlayerData {
	relation: RelationType;
}

interface CommunityValues {
	publicList: PersonData[];
	friendsList: PersonData[];
	inPartyList: PersonData[];
}

interface CommunityState extends CommunityValues {
	// movePersonFromPublicListToPartyList: (person: PersonData) => void;
	// movePersonFromPublicListToFriendsList: (person: PersonData) => void;
	// movePersonFromFriendsListToPartyList: (person: PersonData) => void;
	// movePersonFromPartyListToFriendsList: (person: PersonData) => void;
}

export const useCommunityStore = create<CommunityState>()(
	persist(
		(set) => ({
			publicList: [
				{
					uuid: "12345678-abcd-efgh-ijkl-mnop-00000001",
					name: "Azrul",
					avatar: "avatar-stock-1.webp",
					badge: "Newcomer",
					level: 1,
					xp: 0,
					createdAt: 1784110862000,
					lastLogin: 1784110862000,
					totalPlayed: 1,
					totalWins: 1,
					totalLoss: 1,
					winStreak: 1,
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
					relation: RELATION.STRANGER,
				},
				{
					uuid: "12345678-abcd-efgh-ijkl-mnop-00000002",
					name: "Max",
					avatar: "avatar-stock-2.webp",
					badge: "Newcomer",
					level: 2,
					xp: 1000,
					createdAt: 1784110862000,
					lastLogin: 1784110862000,
					totalPlayed: 2,
					totalWins: 2,
					totalLoss: 2,
					winStreak: 2,
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
					relation: RELATION.STRANGER,
				},
			],
			friendsList: [
				{
					uuid: "12345678-abcd-efgh-ijkl-mnop-10000001",
					name: "Jeremy",
					avatar: "avatar-stock-3.webp",
					badge: "Newcomer",
					level: 3,
					xp: 2000,
					createdAt: 1784110862000,
					lastLogin: 1784110862000,
					totalPlayed: 3,
					totalWins: 3,
					totalLoss: 3,
					winStreak: 3,
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
					relation: RELATION.FRIEND,
				},
				{
					uuid: "12345678-abcd-efgh-ijkl-mnop-10000002",
					name: "Aisyah",
					avatar: "avatar-stock-4.webp",
					badge: "Newcomer",
					level: 4,
					xp: 3000,
					createdAt: 1784110862000,
					lastLogin: 1784110862000,
					totalPlayed: 4,
					totalWins: 4,
					totalLoss: 4,
					winStreak: 4,
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
					relation: RELATION.FRIEND,
				},
			],
			inPartyList: [
				{
					uuid: "12345678-abcd-efgh-ijkl-mnop-20000001",
					name: "Prag",
					avatar: "avatar-stock-5.webp",
					badge: "Newcomer",
					level: 5,
					xp: 4000,
					createdAt: 1784110862000,
					lastLogin: 1784110862000,
					totalPlayed: 5,
					totalWins: 5,
					totalLoss: 5,
					winStreak: 5,
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
					relation: RELATION.FRIEND,
				},
				{
					uuid: "12345678-abcd-efgh-ijkl-mnop-20000002",
					name: "Zhen Min",
					avatar: "avatar-stock-6.webp",
					badge: "Newcomer",
					level: 6,
					xp: 5000,
					createdAt: 1784110862000,
					lastLogin: 1784110862000,
					totalPlayed: 6,
					totalWins: 6,
					totalLoss: 6,
					winStreak: 6,
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
					relation: RELATION.STRANGER,
				},
			],
		}),
		{
			name: "community-storage",
		}
	)
);