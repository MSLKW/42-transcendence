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
	chatVerboseMode: boolean;
	isChatSubscribed: boolean,
	chatSocketId: string | null;
	chatRoomId: string | null;
	cachedChat: ChatData[];
	rateLimitMessage: string | null;
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
	resetValues: () => void;
}

export const useChatStore = create<ChatState>() (
	persist(
		(set, _get) => ({
			chatVerboseMode: false,
			isChatSubscribed: false,
			chatSocketId: null,
			chatRoomId: null,
			cachedChat: [],
			rateLimitMessage: null,

			addToCachedChat: (type, uuid, name, avatar, msg) => {
				set((state: { cachedChat: any }) => ({
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
			},

			resetValues: () => {
				set({
					isChatSubscribed: false,
					chatSocketId: null,
					chatRoomId: null,
					cachedChat: [],
					rateLimitMessage: null,
				});
			},
		}),
		{
			name: 'chat-storage',
		}
	)
);