import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PartyState {
	partyCount: number;
	isHost: boolean;
	nameList: string[];
	avatarList: string[];
	badgesList: string[];
	xpList: number[];
	createdAtList: string[];
	lastLoginList: string[];
	totalPlayedList: number[];
	winStreakList: number[];
	totalWinsList: number[];
	isFriendList: number[];
	achievementList: string[][];

	setPartyCount: (count: number) => void;
	setNameList: (list: string[]) => void;
}

export const usePartyStore = create<PartyState>() (
	persist(
		(set) => ({
			partyCount: 1,
			isHost: true,
			nameList: ["Player", "Void", "Null", "Undefined"],
			avatarList: ["avatar-stock-0", "avatar-stock-1", "avatar-stock-2", "avatar-stock-3"],
			badgesList: ["Beginner's Luck", "Novice", "Enthusiast", "Big 2 Champion"],
			xpList: [1000, 2000, 3000, 4000],
			createdAtList: ["1 July 2026", "2 July 2026", "3 July 2026", "4 July 2026"],
			lastLoginList: ["10 July 2026", "11 July 2026", "12 July 2026", "13 July 2026"],
			totalPlayedList: [20, 21, 22, 23],
			winStreakList: [0, 1, 2, 3],
			totalWinsList: [10, 11, 12, 13],
			isFriendList: [-1, 1, 0, 1],
			achievementList: [[], [], [], []],

			setPartyCount: (count) => set({ partyCount: count }),
			setNameList: (list) => set({ nameList: list }),
		}),
		{
			name: 'party-storage',
		}
	)
);