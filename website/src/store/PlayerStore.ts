import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BADGE_LABEL =
	| "Newcomer"
	| "Beginner's Luck"
	| "Challenger"
	| "Enthusiast"
	| "Risk Taker"
	| "The Strategist"
	| "Big 2 Champion"
	;

export type ACHIEVEMENT_LABEL =
	| "FIRST_LOGIN"
	| "LOGIN_1_WEEK"
	| "PLAYED_1_GAME"
	| "PLAYED_10_GAMES"
	| "PLAYED_42_GAMES"
	| "FIRST_WIN"
	| "WIN_STREAK_2"
	| "WIN_STREAK_5"
	| "WIN_STREAK_10"
	| "MASTER_COLLECTOR"
	;

export interface PlayerData {
	name: string;			//"Azrul", "Max"
	avatar: string;			//"avatar-stock-0.webp", "avatar-azrulsaleh@me.com.png"
	badge: BADGE_LABEL;		//"Newcomer", "Beginner's Luck", "Challenger", "Enthusiast", "Risk Taker",  "The Strategist", "Big 2 Champion"
	level: number;			//1, 42
	xp: number;				//0, 1000000
	createdAt: string;		//"15 July 2026", "n/a"
	lastLogin: string;		//"15 July 2026", "n/a"
	totalPlayed: number;	//0, 1000
	totalWins: number;		//0, 1000
	totalLoss: number;		//0, 1000
	winStreak: number;		//0, 1000
	achievements: Record<ACHIEVEMENT_LABEL, { unlockedAt: number } | null>; //{"FIRST_LOGIN": null, ..., "PLAYED_1_GAME": { unlockedAt: 1784110862000 }}
	isSeated: boolean;		//false, true
	seatNumber: number;		//-1, 0, 1, 2, 3
							//if value is -1, member is not yet seated or spectator
							//from host pov: <4 players> [0 bottom, 1 left, 2 top, 3 right], <3 players> [0 bottom, 1 left, 2 right], <2 players> [0 bottom, 1 top]
							//when rendering from non-host pov, offset seat index placement - totalPlayers so client is at the bottom of their screen
}

export const SEATNUMBER_UNSEATED = -1;

interface PlayerValues {
	data: PlayerData;
	status: number;
}

export const STATUS = {
	OFFLINE: 0,
	AVAILABLE: 1,
	INGAME: 2,
};

interface PlayerState extends PlayerValues {
	setPlayerValue: <K extends keyof PlayerValues>(key: K, value: PlayerValues[K]) => void;
	setPlayerDataValue: <K extends keyof PlayerData>(key: K, value: PlayerData[K]) => void;
	addXP: (xp: number) => void;
	incTotalWins: () => void;
	incTotalLoss: () => void;
	unlockAchievement: (id: ACHIEVEMENT_LABEL) => void;
}

export const usePlayerStore = create<PlayerState>() (
	persist(
		(set) => ({
			data: {
				name: "Player",
				avatar: "avatar-stock-0.webp",
				badge: "Newcomer",
				level: 1,
				xp: 0,
				createdAt: new Date(1784110862000).toISOString(),
				lastLogin: new Date().toISOString(),
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
				seatNumber: SEATNUMBER_UNSEATED,
			},
			status: STATUS.AVAILABLE,

			setPlayerValue: (key, value) => set(() => ({ [key]: value })),
			setPlayerDataValue: (key, value) => set((state) => ({
				data: {
					...state.data,
					[key]: value
				}
			})),
			addXP: (xp) => set((playerStore) => {
				const newXP = playerStore.data.xp + xp;
				return {
					data: {
						...playerStore.data,
						xp: newXP,
						level: Math.floor(newXP / 1000) + 1,
					}
				}
			}),
			incTotalWins: () => set((playerStore) => ({
				data: {
					...playerStore.data,
					totalWins: playerStore.data.totalWins + 1,
					winStreak: playerStore.data.winStreak + 1,
					totalPlayed: playerStore.data.totalPlayed + 1,
				}
			})),
			incTotalLoss: () => set((playerStore) => ({
				data: {
					...playerStore.data,
					totalLoss: playerStore.data.totalLoss + 1,
					winStreak: 0,
					totalPlayed: playerStore.data.totalPlayed + 1,
				}
			})),
			unlockAchievement: (id) => set((playerStore) => {
				if (playerStore.data.achievements[id])
					return {};
				return {
					data: {
						...playerStore.data,
						achievements: {
							...playerStore.data.achievements,
							[id]: { unlockedAt: Date.now() }
						}
					}
				};
			}),
		}),
		{
			name: 'player-storage',
		}
	)
);