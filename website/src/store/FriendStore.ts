import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FriendValues {
	friends: string[];
}

interface FriendState extends FriendValues {
	toggleFriend: (uuid: string) => void;
	resetFriends: () => void;
}

const defaultFriends = [
	"12345678-abcd-efgh-dev0-azrul0000000",
	"12345678-abcd-efgh-dev0-max000000000",
	"12345678-abcd-efgh-dev0-jeremy000000",
	"12345678-abcd-efgh-dev0-aisyah000000",
] as const;

export const useFriendStore = create<FriendState>()(
	persist(
		(set, get) => ({
			friends: [...defaultFriends],

			toggleFriend: (uuid) => {
				const friends = get().friends;
				if (friends.includes(uuid))
					set({ friends: friends.filter((id) => id !== uuid) });
				else
					set({ friends: [...friends, uuid] });
			},

			resetFriends: () => { set({ friends: [...defaultFriends] }) }
		}),
		{
			name: "friend-storage",
		}
	)
);