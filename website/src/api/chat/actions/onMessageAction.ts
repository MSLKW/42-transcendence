import { Socket } from "socket.io-client";
import type { ChatMessage } from "../chatSocket";

export function onMessageAction(socket: Socket, callback: (data: ChatMessage) => void): () => void {
	socket.on("chat_message", callback);
	console.log("[onMessage] callback:", callback);

	return () => {
		socket.off("chat_message", callback);
	};
}