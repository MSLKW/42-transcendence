import { io, Socket } from "socket.io-client";
import { useChatStore, type CHAT_TYPE } from "../../store/ChatStore";
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";

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
	private isConnecting: boolean = false;
	private currentRoomId: string | null = null;

	public connect() {
		if (this.socket?.connected || this.isConnecting)
			return;

		this.isConnecting = true;

		this.socket = io({
			path: "/socket/chat/",
			transports: ["websocket", "polling"],
		});

		this.socket.on("connect", () => {
			this.isConnecting = false;

			const socketId = this.socket?.id ?? null;
			useChatStore.setState({ chatSocketId: socketId });
			
			const roomId = usePartyStore.getState().hostUuid ?? useProfileStore.getState().clientUuid;
			if (roomId) {
				if (usePartyStore.getState().hostUuid)
					this.joinRoom(roomId);
				else
					this.setInitialRoom(roomId);
			}
			console.log("[chatSocket] Connected to chat service with id:", socketId, " with roomId:", roomId);
		});

		this.socket.on("disconnect", (reason) => {
			this.isConnecting = false;
			useChatStore.setState({
				chatSocketId: null,
				chatRoomId: null,
			});
			console.log("[chatSocket] Disconnected:", reason);
		});

		this.socket.on("connect_error", (err) => {
			this.isConnecting = false;
			console.error("[chatSocket] Connection error:", err.message);
		});
	}

	public disconnect() {
		this.isConnecting = false;
		this.currentRoomId = null;
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
		useChatStore.setState({
			chatSocketId: null,
			chatRoomId: null,
		});
	}

	public setInitialRoom(roomId: string) {
		this.currentRoomId = roomId;
		useChatStore.setState({ chatRoomId: roomId });
	}

	public joinRoom(roomId: string) {
		if (this.socket?.connected) {
			this.currentRoomId = roomId;
			useChatStore.setState({ chatRoomId: roomId });
			this.socket.emit("chat_join_room", { roomId: roomId });
			console.log(`[chatSocket] Emitted join for party room: ${roomId}`);
		}
	}

	public sendChat(chatType: string, message: string) {
		if (!this.socket?.connected) {
			console.warn("[sendChat] Cannot send message, socket is not connected");
			return;
		}

		const trimmedMessage = message.trim();
		if (!trimmedMessage)
			return;
		this.socket.emit("chat_message", { type: chatType, message: trimmedMessage } );
	}

	public sendTyping(isTyping: boolean) {
		if (!this.socket?.connected) {
			console.warn("[sendTyping] Cannot send typing state, socket is not connected");
			return;
		}

		console.log("[sendTyping] isTyping:", isTyping);
		this.socket?.emit("chat_typing", { isTyping });
	}

	public onMessage(callback: (data: ChatMessage ) => void) {
		if (!this.socket)
			this.connect();

		this.socket?.on("chat_message", callback);
		return () => {
			this.socket?.off("chat_message", callback);
		};
	}

	public onUserJoined(callback: (data: ChatNotification) => void) {
		if (!this.socket)
			this.connect();

		this.socket?.on("chat_user_joined", callback);
		return () => {
			this.socket?.off("chat_user_joined", callback);
		};
	}

	public onUserLeft(callback: (data: ChatNotification) => void) {
		if (!this.socket)
			this.connect();

		this.socket?.on("chat_user_left", callback);
		return () => {
			this.socket?.off("chat_user_left", callback);
		};
	}

	public onUserTyping(callback: (data: ChatTyping) => void) {
		if (!this.socket)
			this.connect();

		this.socket?.on("chat_user_typing", callback);
		return () => {
			this.socket?.off("chat_user_typing", callback);
		};
	}

	public onRateLimited(callback: (data: ChatRateLimited) => void) {
		if (!this.socket)
			this.connect();

		this.socket?.on("chat_rate_limited", callback);

		return () => {
			this.socket?.off("chat_rate_limited", callback);
		};
	}

	public isConnected(): boolean {
		console.log("[isConnected] id:", this.socket?.id, " currentRoomId:", this.currentRoomId, " socket:", this.socket);
		return this.socket?.connected === true;
	}
}

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		chatSocket.disconnect();
	});
}

export const chatSocket = new ChatSocketService();