//supported chat message categories
export type ChatType = "MESSAGE" | "EMOTE";

//payload for a user joining a chat room
export interface ChatUserJoinedPayload {
	senderUuid: string;
	timestamp: string;
}

//payload for a user leaving a chat room
export interface ChatUserLeftPayload {
	senderUuid: string;
	timestamp: string;
}

//payload describing a user's typing state
export interface ChatIsTypingPayload {
	senderUuid: string;
	isTyping: boolean;
}

//payload carrying a chat message
export interface ChatMessagePayload {
	senderUuid: string;
	type: ChatType;
	message: string;
	timestamp: string;
}

//payload sent when a client exceeds a message limit
export interface ChatRateLimitedPayload {
	type: "MESSAGE" | "EMOTE";
	message: string;
}

//events emitted by chat clients
export interface ClientToServerEvents {
	chat_join_room: (payload: { roomId: string }) => void;
	chat_typing: (payload: { isTyping: boolean }) => void;
	chat_message: (payload: {
		type: ChatType;
		message: string;
	}) => void;
}

//events emitted by the chat server
export interface ServerToClientEvents {
	chat_user_joined: (payload: ChatUserJoinedPayload) => void;
	chat_user_left: (payload: ChatUserLeftPayload) => void;
	chat_user_typing: (payload: ChatIsTypingPayload) => void;
	chat_message: (payload: ChatMessagePayload) => void;
	chat_rate_limited: (payload: ChatRateLimitedPayload) => void;
}
