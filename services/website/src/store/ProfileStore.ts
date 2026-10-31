import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./AuthStore";
import { useFriendsStore } from "./FriendsStore";
import { usePartyStore } from "./PartyStore";
import { handleGetProfile } from "../api/profile/get_profile/handleGetProfile";
import type { PublicBadgeId } from "./GameStatsStore";

export const RELATION_LABEL = [
	"Stranger",
	"Friend",
	"Bot",
	"Self",
] as const;
export type RELATION_TYPE = typeof RELATION_LABEL[number];

export interface CachedProfile {
	name: string | null;
	avatar: string | null;
	badge: PublicBadgeId;
	relation: RELATION_TYPE;
}

export type UserData = {
	username: string | null,
	avatarPath: string | null,
	badge: PublicBadgeId,
};

interface ProfileValues {
	profileVerboseMode: boolean;
	profileValidation: boolean;
	isProfileLoaded: boolean;
	cachedProfiles: Record<string, CachedProfile>;
	avatarVersions: Record<string, number>;
};

interface ProfileState extends ProfileValues {
	setCachedProfile: () => Promise<void>,
	removeCachedProfile: (uuid: string | null) => void;
	markAvatarUpdated: (uuid: string) => void;
	resetValues: () => void;
};

export const useProfileStore = create<ProfileState>() (
	persist(
		(set, _get) => ({
			profileVerboseMode: false,
			profileValidation: true,
			isProfileLoaded: false,
			cachedProfiles: {},
			avatarVersions: {},

			setCachedProfile: async () => {
				const clientUuid = useAuthStore.getState().clientUuid;
				const members = usePartyStore.getState().members;
				const cachedFriends = useFriendsStore.getState().cachedFriends;

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
					const cachedProfiles = { ...state.cachedProfiles };
					for (const profile of profiles) {
						if (!profile)
							continue;
						cachedProfiles[profile.uuid] = profile.data;
					}
					return {
						cachedProfiles,
						isProfileLoaded: true,
					}
				});
			},

			removeCachedProfile: (uuid) => {
				if (!uuid)
					return;

				set((state) => {
					const cachedProfiles = { ...state.cachedProfiles }
					delete cachedProfiles[uuid];
					return { cachedProfiles };
				});
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
					cachedProfiles: {},
					avatarVersions: {},
				});
			},
		}),
		{
			name: 'profile-storage',
		}
	)
);