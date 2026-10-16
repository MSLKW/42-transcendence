import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FriendValues {
	friendsVerboseMode: boolean;
	cachedFriends: string[];
}

interface FriendState extends FriendValues {
	resetValues: () => void;
}

export const useFriendsStore = create<FriendState>() (
	persist(
		(set, _get) => ({
			friendsVerboseMode: false,
			cachedFriends: [],

			resetValues: () => {
				set({ cachedFriends: [] });
			}
		}),
		{
			name: "friend-storage",
		}
	)
);