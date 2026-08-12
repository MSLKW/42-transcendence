import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FriendValues {
}

interface FriendState extends FriendValues {
}

export const useDevStore = create<FriendState>()(
	persist(
		() => ({
		}),
		{
			name: "friend-storage",
		}
	)
);