/** Supported chat message categories */
export type ChatType = "MESSAGE" | "EMOTE";

/** Payload for a user joining a chat room */
export interface ChatUserJoinedPayload {
	senderUuid: string;
	timestamp: string;
}

/** Payload for a user leaving a chat room */
export interface ChatUserLeftPayload {
	senderUuid: string;
	timestamp: string;
}

/** Payload describing a user's typing state */
export interface ChatIsTypingPayload {
	senderUuid: string;
	isTyping: boolean;
}

/** Payload carrying a chat message */
export interface ChatMessagePayload {
	senderUuid: string;
	type: ChatType;
	message: string;
	timestamp: string;
}

/** Payload sent when a client exceeds a message limit */
export interface ChatRateLimitedPayload {
	type: "MESSAGE" | "EMOTE";
	message: string;
}

/** Events emitted by chat clients */
export interface ClientToServerEvents {
	chat_join_room: (payload: { roomId: string }) => void;
	chat_typing: (payload: { isTyping: boolean }) => void;
	chat_message: (payload: {
		type: ChatType;
		message: string;
	}) => void;
}

/** Events emitted by the chat server */
export interface ServerToClientEvents {
	chat_user_joined: (payload: ChatUserJoinedPayload) => void;
	chat_user_left: (payload: ChatUserLeftPayload) => void;
	chat_user_typing: (payload: ChatIsTypingPayload) => void;
	chat_message: (payload: ChatMessagePayload) => void;
	chat_rate_limited: (payload: ChatRateLimitedPayload) => void;
}
