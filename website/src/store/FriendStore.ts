import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FriendValues {
	friendUuids: string[],
}

interface FriendState extends FriendValues {
	setFriendUuids: (uuids: string[]) => void;
	isAFriend: (uuid: string) => boolean;
	toggleFriend: (uuid: string) => void,
}

export const useFriendStore = create<FriendState>()(
	persist(
		(set, get) => ({
			friendUuids: [],

			setFriendUuids: (uuids) => {
				set ({
					friendUuids: uuids
				});
			},

			isAFriend: (uuid) => {
				return get().friendUuids.includes(uuid);
			},

			toggleFriend: (uuid) => {
				const currentFriends = get().friendUuids;
				if (currentFriends.includes(uuid)) {
					set({
						friendUuids: currentFriends.filter((id) => id !== uuid),
					})
				} else {
					set ({
						friendUuids: [...currentFriends, uuid],
					});
				}
			}
		}),
		{
			name: "friend-storage",
		}
	)
);