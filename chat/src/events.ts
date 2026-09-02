export interface ChatMessagePayload {
	senderUuid: string;
	type:string;
	message: string;
	timestamp: string;
}

export interface ChatUserJoinedPayload {
	senderUuid: string;
	timestamp: string;
}

export interface ChatUserLeftPayload {
	senderUuid: string;
	timestamp: string;
}

export interface ClientToServerEvents {
	chat_join_room: (payload: {
		roomId: string;
	}) => void;

	chat_message: (payload: {
		type: string;
		message: string;
	}) => void;
}

export interface ServerToClientEvents {
	chat_user_joined: (payload: ChatUserJoinedPayload) => void;
	chat_user_left: (payload: ChatUserLeftPayload) => void;
	chat_message: (payload: ChatMessagePayload) => void;
}