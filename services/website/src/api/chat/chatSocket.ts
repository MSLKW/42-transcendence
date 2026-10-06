import { io, Socket } from "socket.io-client";
import { useChatStore, type CHAT_TYPE } from "../../store/ChatStore";
import { connectionHandlers } from "./handlers/connectionHandlers";
import { joinRoomAction } from "./actions/joinRoomAction";
import { onMessageAction } from "./actions/onMessageAction";
import { onRateLimitedAction } from "./actions/onRateLimitedAction";
import { onUserJoinedAction } from "./actions/onUserJoinedAction";
import { onUserLeftAction } from "./actions/onUserLeftAction";
import { onUserTypingAction } from "./actions/onUserTypingAction";
import { sendChatAction } from "./actions/sendChatAction";
import { sendTypingAction } from "./actions/sendTypingAction";

const chatSocketUrl = import.meta.env.VITE_SOCKET_URL;

export type ChatMessage = {
	type: CHAT_TYPE;
	senderUuid: string;
	message: string;
	timestamp: string;
};

export type ChatNotification = {
	senderUuid: string;
	timestamp: string;
};

export type ChatTyping = {
	senderUuid: string;
	isTyping: boolean;
};

export type ChatRateLimited = {
	type: CHAT_TYPE;
	message: string;
};

class ChatSocketService {
	private socket: Socket | null = null;

	public connect() {
		if (this.socket) {
			if (!this.socket.connected)
				this.socket.connect();
			return;
		}

		this.socket = io(chatSocketUrl, {
			path: import.meta.env.SOCKET_CHAT_PATH,
			transports: ["websocket", "polling"],
			autoConnect: false,
			reconnection: true,
			reconnectionAttempts: Infinity,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
		});

		connectionHandlers(
			this.socket
		);

		this.socket.connect();
	}
	public disconnect() {
		if (!this.socket)
			return;

		this.socket.disconnect();
		this.socket = null;

		useChatStore.setState({
			chatSocketId: null,
			chatRoomId: null,
		});
	}
	public reconnect() {
		if (!this.socket) {
			this.connect();
			return;
		}

		if (!this.socket.connected)
			this.socket.connect();
	}

	public setInitialRoom = (roomId: string) => {
		useChatStore.setState({ chatRoomId: roomId });
	}
	public joinRoom = (roomId: string) => {
		joinRoomAction(this.socket, roomId);
	}
	public sendChat = (chatType: string, message: string) => {
		sendChatAction(this.socket, chatType, message);
	}
	public sendTyping = (isTyping: boolean) => {
		sendTypingAction(this.socket, isTyping);
	}
	public onMessage(callback: (data: ChatMessage ) => void): () => void {
		if (!this.socket)
			return () => {};
		return onMessageAction(this.socket, callback);
	}
	public onUserJoined(callback: (data: ChatNotification) => void): () => void {
		if (!this.socket)
			return () => {};
		return onUserJoinedAction(this.socket, callback);
	}
	public onUserLeft(callback: (data: ChatNotification) => void): () => void {
		if (!this.socket)
			return () => {};
		return onUserLeftAction(this.socket, callback);
	}
	public onUserTyping(callback: (data: ChatTyping) => void): () => void {
		if (!this.socket)
			return () => {};
		return onUserTypingAction(this.socket, callback);
	}
	public onRateLimited(callback: (data: ChatRateLimited) => void): () => void {
		if (!this.socket)
			return () => {};
		return onRateLimitedAction(this.socket, callback);
	}
	public isConnected(): boolean {
		return this.socket?.connected === true;
	}
}

export const chatSocket = new ChatSocketService();