import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CHAT_TYPE = "MESSAGE" | "REPORT" | "EMOTE";

export interface ChatData {
	type: CHAT_TYPE,
	uuid: string,
	name: string,
	avatar: string,
	msg: string,
}

let rateLimitTimeout: ReturnType<typeof setTimeout> | null = null;

interface ChatValues {
	chatSocketId: string | null;
	chatRoomId: string | null;
	cachedChat: ChatData[];
	rateLimitMessage: string | null;
	chatReconnect: number;
}

interface ChatState extends ChatValues {
	addToCachedChat: (
		type: CHAT_TYPE,
		uuid: string,
		name: string,
		avatar: string | undefined,
		msg: string
	) => void;

	showRateLimitMessage: (message: string) => void;
}

export const useChatStore = create<ChatState>() (
	persist(
		(set, _get) => ({
			chatSocketId: null,
			chatRoomId: null,
			cachedChat: [],
			rateLimitMessage: null,
			chatReconnect: 0,

			addToCachedChat: (type, uuid, name, avatar, msg) => {
				set((state) => ({
					cachedChat: [
						...state.cachedChat,
						{ type, uuid, name, avatar, msg }
					]
				}));
			},

			showRateLimitMessage: (message) => {
				if (rateLimitTimeout)
					clearTimeout(rateLimitTimeout);

				set({ rateLimitMessage: message });
				rateLimitTimeout = setTimeout(() => {
					set({ rateLimitMessage: null });
					rateLimitTimeout = null;
				}, 3000);
			}
		}),
		{
			name: 'chat-storage',
		}
	)
);