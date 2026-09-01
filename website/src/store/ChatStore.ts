import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CHAT_TYPE = "MESSAGE" | "NOTIFICATION";

export interface ChatData {
	type: CHAT_TYPE,
	uuid: string,
	name: string,
	avatar: string,
	msg: string,
}

interface ChatValues {
	chatSocketId: string | null;
	chatRoomId: string | null;
	cachedChat: ChatData[];
}

interface ChatState extends ChatValues {
	addToCachedChat: (
		type: CHAT_TYPE,
		uuid: string,
		name: string,
		avatar: string,
		msg: string
	) => void;
}

export const useChatStore = create<ChatState>() (
	persist(
		(set, _get) => ({
			chatSocketId: null,
			chatRoomId: null,
			cachedChat: [],

			addToCachedChat: (type, uuid, name, avatar, msg) => {
				set((state) => ({
					cachedChat: [
						...state.cachedChat,
						{ type, uuid, name, avatar, msg }
					]
				}));
			},
		}),
		{
			name: 'chat-storage',
		}
	)
);