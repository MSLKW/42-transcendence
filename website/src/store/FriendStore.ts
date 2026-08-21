import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FriendValues {
	friends: string[],
}

interface FriendState extends FriendValues {
	setFriendUuids: (uuids: string[]) => void,
	isAFriend: (uuid: string) => boolean,
	toggleFriend: (uuid: string) => void,
	resetFriends: () => void;
}

export const useFriendStore = create<FriendState>()(
	persist(
		(set, get) => ({
			friends: [
				"12345678-abcd-efgh-dev0-azrul0000000",
				"12345678-abcd-efgh-dev0-max000000000",
				"12345678-abcd-efgh-dev0-jeremy000000",
				"12345678-abcd-efgh-dev0-aisyah000000",
			],

			setFriendUuids: (uuids) => {
				set ({
					friends: uuids
				});
			},

			isAFriend: (uuid) => {
				return get().friends.includes(uuid);
			},

			toggleFriend: (uuid) => {
				const currentFriends = get().friends;
				if (currentFriends.includes(uuid)) {
					set({
						friends: currentFriends.filter((id) => id !== uuid),
					})
				} else {
					set ({
						friends: [...currentFriends, uuid],
					});
				}
			},

			resetFriends: () => {
				set({
					friends: [
						"12345678-abcd-efgh-dev0-azrul0000000",
						"12345678-abcd-efgh-dev0-max000000000",
						"12345678-abcd-efgh-dev0-jeremy000000",
						"12345678-abcd-efgh-dev0-aisyah000000",
					],
				})
			}
		}),
		{
			name: "friend-storage",
		}
	)
);