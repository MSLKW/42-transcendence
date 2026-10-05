import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FriendValues {
	cachedFriends: string[];
}

interface FriendState extends FriendValues {
	toggleFriend: (uuid: string) => void;
	resetValues: () => void;
}

const defaultFriends = [
	"12345678-abcd-efgh-dev0-azrul0000000",
	"12345678-abcd-efgh-dev0-max000000000",
	"12345678-abcd-efgh-dev0-jeremy000000",
	"12345678-abcd-efgh-dev0-aisyah000000",
] as const;

export const useFriendStore = create<FriendState>() (
	persist(
		(set, get) => ({
			cachedFriends: [...defaultFriends],

			toggleFriend: (uuid) => {
				const cachedFriends = get().cachedFriends;
				if (cachedFriends.includes(uuid))
					set({ cachedFriends: cachedFriends.filter((id) => id !== uuid) });
				else
					set({ cachedFriends: [...cachedFriends, uuid] });
			},

			resetValues: () => {
				set({
					cachedFriends: [...defaultFriends]
				});
			}
		}),
		{
			name: "friend-storage",
		}
	)
);