export type ChatType = "MESSAGE" | "EMOTE";

export interface ChatUserJoinedPayload {
	senderUuid: string;
	timestamp: string;
}

export interface ChatUserLeftPayload {
	senderUuid: string;
	timestamp: string;
}

export interface ChatIsTypingPayload {
	senderUuid: string;
	isTyping: boolean;
}

export interface ChatMessagePayload {
	senderUuid: string;
	type: ChatType;
	message: string;
	timestamp: string;
}

export interface ChatRateLimitedPayload {
	type: "MESSAGE" | "EMOTE";
	message: string;
}

export interface ClientToServerEvents {
	chat_join_room: (payload: {
		roomId: string;
	}) => void;

	chat_typing: (paylod: {
		isTyping: boolean;
	}) => void;

	chat_message: (payload: {
		type: ChatType;
		message: string;
	}) => void;
}

export interface ServerToClientEvents {
	chat_user_joined: (payload: ChatUserJoinedPayload) => void;
	chat_user_left: (payload: ChatUserLeftPayload) => void;
	chat_user_typing: (payload: ChatIsTypingPayload) => void;
	chat_message: (payload: ChatMessagePayload) => void;
	chat_rate_limited: (payload: ChatRateLimitedPayload) => void;
}