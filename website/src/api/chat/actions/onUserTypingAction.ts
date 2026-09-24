import { Socket } from "socket.io-client";
import type { ChatTyping } from "../chatSocket";

export function onUserTypingAction(socket: Socket, callback: (data: ChatTyping) => void): () => void {
	socket.on("chat_user_typing", callback);
	console.log("[onUserTyping] callback:", callback);

	return () => {
		socket.off("chat_user_typing", callback);
	};
}