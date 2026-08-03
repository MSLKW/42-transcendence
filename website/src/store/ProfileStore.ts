import { create } from "zustand";
import { persist } from "zustand/middleware";

export const BADGE_LABEL = [
	"Newcomer",
	"Beginner's Luck",
	"Challenger",
	"Enthusiast",
	"Risk Taker",
	"The Strategist",
	"Big 2 Champion",
] as const;

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

export const STATUS = {
	OFFLINE: 0,
	AVAILABLE: 1,
	INGAME: 2,
} as const;

export interface ProfileData {
	uuid: string;			//"b5dd8b9f-cbd0-4814-8a86-d143b3575ca8"
	name: string | null;	//"Azrul", null
	avatar: string;			//"avatar-stock-0.webp", "avatar-12345678901234567890123456789012.png"
	badge: string;			//"Newcomer", "Beginner's Luck", "Challenger", "Enthusiast", "Risk Taker",  "The Strategist", "Big 2 Champion"
	level: number;			//1, 42
	xp: number;				//0, 1000000
	createdAt: number;		//1784110862000 -> "14 July 2026: 16:00:00.000"
	lastLogin: number;		//1784110862000 -> "14 July 2026: 16:00:00.000"
	totalPlayed: number;	//0, 1000
	totalWins: number;		//0, 1000
	totalLoss: number;		//0, 1000
	winStreak: number;		//0, 1000
	achievements: Record<ACHIEVEMENT_LABEL, number | null>; //{"FIRST_LOGIN": null, ..., "PLAYED_1_GAME": 1784110862000}
}

interface ProfileValues {
	data: ProfileData;
	status: number;
}

interface ProfileState extends ProfileValues {
	setProfileValue: <K extends keyof ProfileValues>(key: K, value: ProfileValues[K]) => void;
	setProfileDataValue: <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => void;
	incTotalWins: () => void;
	incTotalLoss: () => void;
	unlockAchievement: (id: ACHIEVEMENT_LABEL) => void;
}

export const useProfileStore = create<ProfileState>() (
	persist(
		(set) => ({
			data: {
				uuid: "",
				name: null,
				avatar: "avatar-stock-0.webp",
				badge: BADGE_LABEL[0],
				level: 1,
				xp: 0,
				createdAt: 1784110862000,
				lastLogin: 1784110862000,
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
			},
			status: STATUS.AVAILABLE,

			setProfileValue: (key, value) => set(() => ({ [key]: value })),
			setProfileDataValue: (key, value) => set((state) => ({
				data: {
					...state.data,
					[key]: value
				}
			})),
			incTotalWins: () => set((profileStore) => {
				const newXP = profileStore.data.xp + 420;
				return {
					data: {
						...profileStore.data,
						totalWins: profileStore.data.totalWins + 1,
						winStreak: profileStore.data.winStreak + 1,
						totalPlayed: profileStore.data.totalPlayed + 1,
						xp: newXP,
						level: Math.floor(newXP / 1000) + 1,
					}
				}
			}),
			incTotalLoss: () => set((profileStore) => {
				const newXP = profileStore.data.xp + 67;
				return {
					data: {
						...profileStore.data,
						totalLoss: profileStore.data.totalLoss + 1,
						winStreak: 0,
						totalPlayed: profileStore.data.totalPlayed + 1,
						xp: newXP,
						level: Math.floor(newXP / 1000) + 1,
					}
				}
			}),
			unlockAchievement: (id) => set((profileStore) => {
				if (profileStore.data.achievements[id])
					return {};
				return {
					data: {
						...profileStore.data,
						achievements: {
							...profileStore.data.achievements,
							[id]: Date.now()
						}
					}
				};
			}),
		}),
		{
			name: 'profile-storage',
		}
	)
);