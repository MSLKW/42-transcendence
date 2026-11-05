import { create } from "zustand";
import { persist } from "zustand/middleware";
import { handleFriendships } from "../api/friends/get_friendships/handleFriendships";

interface FriendValues {
	friendsVerboseMode: boolean;
	cachedFriends: string[];
	friendRequestSent: string[];
}

interface FriendState extends FriendValues {
	resetValues: () => void;
}

export const useFriendsStore = create<FriendState>() (
	persist(
		(set, _get) => ({
			friendsVerboseMode: false,
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
		}
	)
);