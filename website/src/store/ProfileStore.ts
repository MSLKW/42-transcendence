import { create } from "zustand";
import { persist } from "zustand/middleware";
import { usePartyStore, type AVAILABILITY_TYPE } from "./PartyStore";
import { useFriendStore } from "./FriendStore";
import { handleGetProfile } from "../api/profile/get_profile/handleGetProfile";

export const BADGE_LABEL = [
	"Newcomer",
	"Beginner's Luck",
	"Challenger",
	"Enthusiast",
	"Risk Taker",
	"The Strategist",
	"Big 2 Champion",
] as const;
export type BADGE_TYPE = typeof BADGE_LABEL[number];

export const MEDAL_LABEL = [
	"High",
	"Double",
	"Triple",
	"Straight",
	"Flush",
	"Full House",
	"4 Of A Kind",
	"Straight Flush",
	"First Win",
	"3 Of Diamonds",
	"2 Of Spades",
	"No Pass",
] as const;
export type MEDAL_TYPE = typeof MEDAL_LABEL[number];

export const RELATION_LABEL = [
	"Stranger",
	"Friend",
	"Bot",
	"Self",
] as const;
export type RELATION_TYPE = typeof RELATION_LABEL[number];

export interface ProfileData {
	uuid: string | null;
	name: string | null;
	avatar: string | null;
	badge: BADGE_TYPE;
	level: number;
	xp: number;
	createdAt: Date;
	lastLogin: Date;
	totalPlayed: number;
	totalWins: number;
	totalLoss: number;
	winStreak: number;
	medals: Record<MEDAL_TYPE, Date | null>;
	availability: AVAILABILITY_TYPE;
}

export interface CachedData {
	uuid: string | null;
	name: string | null;
	avatar: string | null;
	badge: BADGE_TYPE;
	relation: RELATION_TYPE;
}

export const createDefaultProfile = (uuid: string, name: string, avatar: string, badge: BADGE_TYPE = "Newcomer"): ProfileData => ({
	uuid,
	name,
	avatar,
	badge,
	level: 1,
	xp: 0,
	createdAt: new Date(),
	lastLogin: new Date(),
	totalPlayed: 0,
    totalWins: 0,
    totalLoss: 0,
    winStreak: 0,
    medals: {
		"High": null,
		"Double": null,
		"Triple": null,
		"Straight": null,
		"Flush": null,
		"Full House": null,
		"4 Of A Kind": null,
		"Straight Flush": null,
		"First Win": null,
		"3 Of Diamonds": null,
		"2 Of Spades": null,
		"No Pass": null,
    },
    availability: "Online",
});

const defaultProfileInDb: ProfileData[] = [
	{
		uuid: "12345678-abcd-efgh-dev0-azrul0000000",
		name: "Dev-Azrul",
		avatar: "avatar-animal-8.webp",
		badge: "Risk Taker",
		level: 2,
		xp: 1111,
		createdAt: new Date("2026-08-01T01:01:01+08:00"),
		lastLogin: new Date("2026-08-01T01:01:01+08:00"),
		totalPlayed: 1,
		totalWins: 1,
		totalLoss: 1,
		winStreak: 1,
		medals: {
			"High": new Date("2026-08-01T01:01:01+08:00"),
			"Double": null,
			"Triple": null,
			"Straight": null,
			"Flush": null,
			"Full House": null,
			"4 Of A Kind": null,
			"Straight Flush": null,
			"First Win": null,
			"3 Of Diamonds": null,
			"2 Of Spades": null,
			"No Pass": null,
		},
		availability: "Offline",
	},
	{
		uuid: "12345678-abcd-efgh-dev0-max000000000",
		name: "Dev-Max",
		avatar: "avatar-animal-2.webp",
		badge: "The Strategist",
		level: 3,
		xp: 2222,
		createdAt: new Date("2026-08-01T02:02:02+08:00"),
		lastLogin: new Date("2026-08-01T02:02:02+08:00"),
		totalPlayed: 2,
		totalWins: 2,
		totalLoss: 2,
		winStreak: 2,
		medals: {
			"High": new Date("2026-08-01T02:02:02+08:00"),
			"Double": new Date("2026-08-01T02:02:02+08:00"),
			"Triple": null,
			"Straight": null,
			"Flush": null,
			"Full House": null,
			"4 Of A Kind": null,
			"Straight Flush": null,
			"First Win": null,
			"3 Of Diamonds": null,
			"2 Of Spades": null,
			"No Pass": null,
		},
		availability: "Offline",
	},
	{
		uuid: "12345678-abcd-efgh-dev0-jeremy000000",
		name: "Dev-Jeremy",
		avatar: "avatar-animal-3.webp",
		badge: "Big 2 Champion",
		level: 4,
		xp: 3333,
		createdAt: new Date("2026-08-01T03:03:03+08:00"),
		lastLogin: new Date("2026-08-01T03:03:03+08:00"),
		totalPlayed: 3,
		totalWins: 3,
		totalLoss: 3,
		winStreak: 3,
		medals: {
			"High": new Date("2026-08-01T03:03:03+08:00"),
			"Double": new Date("2026-08-01T03:03:03+08:00"),
			"Triple": new Date("2026-08-01T03:03:03+08:00"),
			"Straight": null,
			"Flush": null,
			"Full House": null,
			"4 Of A Kind": null,
			"Straight Flush": null,
			"First Win": null,
			"3 Of Diamonds": null,
			"2 Of Spades": null,
			"No Pass": null,
		},
		availability: "Offline",
	},
	{
		uuid: "12345678-abcd-efgh-dev0-aisyah000000",
		name: "Dev-Aisyah",
		avatar: "avatar-animal-0.webp",
		badge: "Newcomer",
		level: 5,
		xp: 4444,
		createdAt: new Date("2026-08-01T04:04:04+08:00"),
		lastLogin: new Date("2026-08-01T04:04:04+08:00"),
		totalPlayed: 4,
		totalWins: 4,
		totalLoss: 4,
		winStreak: 4,
		medals: {
			"High": new Date("2026-08-01T04:04:04+08:00"),
			"Double": new Date("2026-08-01T04:04:04+08:00"),
			"Triple": new Date("2026-08-01T04:04:04+08:00"),
			"Straight": new Date("2026-08-01T04:04:04+08:00"),
			"Flush": null,
			"Full House": null,
			"4 Of A Kind": null,
			"Straight Flush": null,
			"First Win": null,
			"3 Of Diamonds": null,
			"2 Of Spades": null,
			"No Pass": null,
		},
		availability: "Offline",
	},
	{
		uuid: "12345678-abcd-efgh-dev0-bunyod000000",
		name: "Dev-Bunyod",
		avatar: "avatar-animal-4.webp",
		badge: "Newcomer",
		level: 6,
		xp: 5555,
		createdAt: new Date("2026-08-01T05:05:05+08:00"),
		lastLogin: new Date("2026-08-01T05:05:05+08:00"),
		totalPlayed: 5,
		totalWins: 5,
		totalLoss: 5,
		winStreak: 5,
		medals: {
			"High": new Date("2026-08-01T05:05:05+08:00"),
			"Double": new Date("2026-08-01T05:05:05+08:00"),
			"Triple": new Date("2026-08-01T05:05:05+08:00"),
			"Straight": new Date("2026-08-01T05:05:05+08:00"),
			"Flush": new Date("2026-08-01T05:05:05+08:00"),
			"Full House": null,
			"4 Of A Kind": null,
			"Straight Flush": null,
			"First Win": null,
			"3 Of Diamonds": null,
			"2 Of Spades": null,
			"No Pass": null,
		},
		availability: "Online",
	},
	{
		uuid: "12345678-abcd-efgh-dev0-prag00000000",
		name: "Dev-Prag",
		avatar: "avatar-animal-5.webp",
		badge: "Newcomer",
		level: 7,
		xp: 6666,
		createdAt: new Date("2026-08-01T06:06:06+08:00"),
		lastLogin: new Date("2026-08-01T06:06:06+08:00"),
		totalPlayed: 6,
		totalWins: 6,
		totalLoss: 6,
		winStreak: 6,
		medals: {
			"High": new Date("2026-08-01T06:06:06+08:00"),
			"Double": new Date("2026-08-01T06:06:06+08:00"),
			"Triple": new Date("2026-08-01T06:06:06+08:00"),
			"Straight": new Date("2026-08-01T06:06:06+08:00"),
			"Flush": new Date("2026-08-01T06:06:06+08:00"),
			"Full House": new Date("2026-08-01T06:06:06+08:00"),
			"4 Of A Kind": null,
			"Straight Flush": null,
			"First Win": null,
			"3 Of Diamonds": null,
			"2 Of Spades": null,
			"No Pass": null,
		},
		availability: "Busy",
	},
];

export const cachedBotData: CachedData[] = [
	{
		uuid: "bot-0",
		name: "Norminette",
		avatar: "avatar-bot-0.webp",
		relation: "Bot",
		badge: "Newcomer",
	},
	{
		uuid: "bot-1",
		name: "Moulinette",
		avatar: "avatar-bot-1.webp",
		relation: "Bot",
		badge: "Newcomer",
	},
	{
		uuid: "bot-2",
		name: "Thila-Bot",
		avatar: "avatar-bot-2.webp",
		relation: "Bot",
		badge: "Newcomer",
	},
	{
		uuid: "bot-3",
		name: "Segfault",
		avatar: "avatar-bot-3.webp",
		relation: "Bot",
		badge: "Newcomer",
	},
];

export type UserData = {
	username: string | null,
	avatarPath: string | null,
	badge: BADGE_TYPE,
};

interface ProfileValues {
	clientUuid: string | null,
	isAuthenticated: boolean,
	validateResponse: Response | undefined,
	profilesInDb: ProfileData[],
	cachedData: CachedData[],
};

interface ProfileState extends ProfileValues {
	getProfileData: (uuid: string | null) => ProfileData | undefined,
	resetProfilesInDb: () => void,
	setCachedData: () => Promise<void>,
	getCachedData: (uuid: string | null) => CachedData | undefined,
};

export const useProfileStore = create<ProfileState>() (
	persist(
		(set, get) => ({
			clientUuid: null,
			isAuthenticated: false, 
			validateResponse: undefined,
			profilesInDb: defaultProfileInDb,
			cachedData: [],

			getProfileData: (uuid) => {
				if (!uuid)
					return undefined;
				const profilesInDb = get().profilesInDb;
				return profilesInDb.find(p => p.uuid === uuid);
			},
			resetProfilesInDb: () => {
				set({
					profilesInDb: defaultProfileInDb,
					cachedData: [],
				});
			},
			setCachedData: async () => {
				const clientUuid = get().clientUuid;
				const members = usePartyStore.getState().members;
				const cachedFriends = useFriendStore.getState().cachedFriends;

				const allUuids = Array.from(
					new Set([...members, ...(clientUuid ? [clientUuid] : [])])
				);
				const cachedMemberData = (
					await Promise.all(
						allUuids.map(async (memberUuid: string | null): Promise<CachedData | null> => {
							if (!memberUuid)
								return null;

							const userData = await handleGetProfile(memberUuid);
							if (!userData)
								return null;

							const humanRelation: RELATION_TYPE = 
								memberUuid === clientUuid ? "Self" :
								cachedFriends.includes(memberUuid) ? "Friend" :
								"Stranger";

							return {
								uuid: memberUuid!,
								name: userData.username,
								avatar: userData.avatarPath,
								badge: userData.badge,
								relation: humanRelation,
							}
						})
					)
				).filter((profile): profile is CachedData => profile !== null);

				set({ cachedData: cachedMemberData });
			},
			getCachedData: (uuid) => {
				if (!uuid)
					return;
				const cachedData = get().cachedData;
				return cachedData.find(p => p.uuid === uuid);
			},
		}),
		{
			name: 'profile-storage',
		}
	)
);