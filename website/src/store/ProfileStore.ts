import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./AuthStore";
import { useFriendStore } from "./FriendStore";
import { usePartyStore, type AVAILABILITY_TYPE } from "./PartyStore";
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
	name: string | null;
	avatar: string | null;
	badge: BADGE_TYPE;
	relation: RELATION_TYPE;
}

export type UserData = {
	username: string | null,
	avatarPath: string | null,
	badge: BADGE_TYPE,
};

interface ProfileValues {
	profileVerboseMode: boolean;
	profileValidation: boolean;
	isProfileLoaded: boolean;
	cachedData: Record<string, CachedData>;
	avatarVersions: Record<string, number>;
};

interface ProfileState extends ProfileValues {
	getProfileData: (uuid: string | null) => ProfileData | undefined,
	resetProfilesInDb: () => void,
	setCachedData: () => Promise<void>,
	removeCachedData: (uuid: string | null) => void;
	clearCachedData: () => void;
	markAvatarUpdated: (uuid: string) => void;
	resetValues: () => void;
};

export const useProfileStore = create<ProfileState>() (
	persist(
		(set, _get) => ({
			profileVerboseMode: false,
			profileValidation: true,
			isProfileLoaded: false,
			cachedData: {},
			avatarVersions: {},

			getProfileData: (uuid) => {
				// if (!uuid)
				// 	return undefined;
				// const profilesInDb = get().profilesInDb;
				// return profilesInDb.find(p => p.uuid === uuid);
				return undefined;
			},

			resetProfilesInDb: () => {
				set({
					cachedData: {},
				});
			},

			setCachedData: async () => {
				const clientUuid = useAuthStore.getState().clientUuid;
				const members = usePartyStore.getState().members;
				const cachedFriends = useFriendStore.getState().cachedFriends;

				const allUuids = Array.from(
					new Set([
						...members,
						...(clientUuid ? [clientUuid] : [])
					])
				).filter(
					(uuid): uuid is string => uuid !== null
				);

				const profiles = await Promise.all(
					allUuids.map(async (memberUuid) => {
						const userData = await handleGetProfile(memberUuid);
						if (!userData)
							return null;

						const humanRelation: RELATION_TYPE = 
							memberUuid === clientUuid ? "Self" :
							cachedFriends.includes(memberUuid) ? "Friend" :
							"Stranger";

						return {
							uuid: memberUuid,
							data: {
								name: userData.username,
								avatar: userData.avatarPath,
								badge: userData.badge,
								relation: humanRelation,
							},
						}
					})
				);

				set((state) => {
					const cachedData = { ...state.cachedData };
					for (const profile of profiles) {
						if (!profile)
							continue;
						cachedData[profile.uuid] = profile.data;
					}
					return {
						cachedData,
						isProfileLoaded: true,
					}
				});
			},

			removeCachedData: (uuid) => {
				if (!uuid)
					return;

				set((state) => {
					const cachedData = { ...state.cachedData }
					delete cachedData[uuid];
					return { cachedData };
				});
			},

			clearCachedData: () => {
				set({ cachedData: {} });
			},

			markAvatarUpdated: (uuid) => {
				set((state) => ({
					avatarVersions: {
						...state.avatarVersions,
						[uuid]: (state.avatarVersions[uuid] ?? 0) + 1,
					},
				}))
			},

			resetValues: () => {
				set({
					isProfileLoaded: false,
					cachedData: {},
					avatarVersions: {},
				});
			},
		}),
		{
			name: 'profile-storage',
		}
	)
);