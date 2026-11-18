import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FriendValues {
	friendsAPIConnection: boolean;
	friendsVerboseMode: boolean;
	isFriendsConnected: boolean;
	cachedFriends: string[];
	friendRequestSent: string[];
}

interface FriendState extends FriendValues {
	resetValues: () => void;
}

export const useFriendsStore = create<FriendState>() (
	persist(
		(set, _get) => ({
			friendsAPIConnection: true,
			friendsVerboseMode: false,
			isFriendsConnected: false,
			cachedFriends: [],
			friendRequestSent: [],

			resetValues: () => {
				set({
					cachedFriends: [],
					friendRequestSent: [],
				});
			}
		}),
		{
			name: "friend-storage",

			partialize: (state) => ({
				friendsAPIConnection: state.friendsAPIConnection,
				friendsVerboseMode: state.friendsVerboseMode,
				cachedFriends: state.cachedFriends,
			}),
		}
	)
);