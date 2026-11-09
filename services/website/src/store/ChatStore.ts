import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CHAT_TYPE = "MESSAGE" | "REPORT" | "EMOTE";

export interface ChatData {
	type: CHAT_TYPE,
	uuid: string,
	name: string,
	avatar: string | undefined,
	msg: string,
}

const MAX_CACHED_MESSAGES = 100;
export const MAX_MESSAGE_LENGTH = 500;

let rateLimitTimeout: ReturnType<typeof setTimeout> | null = null;

interface ChatValues {
	chatAPIConnection: boolean;
	chatVerboseMode: boolean;
	chatSocketId: string | null;
	chatRoomId: string | null;
	chatLog: ChatData[];
	isChatRateLimited: boolean;
}

interface ChatState extends ChatValues {
	addToCachedChat: (
		type: CHAT_TYPE,
		uuid: string,
		name: string,
		avatar: string | undefined,
		msg: string
	) => void;
	rateLimitedIsTrue: () => void;
	resetValues: () => void;
}

export const useChatStore = create<ChatState>() (
	persist(
		(set) => ({
			chatAPIConnection: true,
			chatVerboseMode: false,
			chatSocketId: null,
			chatRoomId: null,
			chatLog: [],
			isChatRateLimited: false,

			addToCachedChat: (type, uuid, name, avatar, msg) => {
				set((state) => ({
					chatLog: [
						...state.chatLog,
						{ type, uuid, name, avatar, msg }
					].slice(-MAX_CACHED_MESSAGES)
				}));
			},

			rateLimitedIsTrue: () => {
				if (rateLimitTimeout)
					clearTimeout(rateLimitTimeout);

				set({ isChatRateLimited: true });

				rateLimitTimeout = setTimeout(() => {
					set({ isChatRateLimited: false });
					rateLimitTimeout = null;
				}, 3000);
			},

			resetValues: () => {
				if (rateLimitTimeout){
					clearTimeout(rateLimitTimeout);
					rateLimitTimeout = null;
				}

				set({
					chatSocketId: null,
					chatRoomId: null,
					chatLog: [],
					isChatRateLimited: false,
				});
			},
		}),
		{
			name: 'chat-storage',

			partialize: (state) => ({
				chatAPIConnection: state.chatAPIConnection,
				chatVerboseMode: state.chatVerboseMode,
			}),
		}
	)
);