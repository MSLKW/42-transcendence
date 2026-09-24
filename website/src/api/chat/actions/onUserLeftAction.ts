import { Socket } from "socket.io-client";
import type { ChatNotification } from "../chatSocket";

export function onUserLeftAction(socket: Socket, callback: (data: ChatNotification) => void): () => void {
	socket.on("chat_user_left", callback);
	console.log("[onUserLeft] callback:", callback);

	return () => {
		socket.off("chat_user_left", callback);
	};
}