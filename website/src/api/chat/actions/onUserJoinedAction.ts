import { Socket } from "socket.io-client";
import type { ChatNotification } from "../chatSocket";

export function onUserJoinedAction(socket: Socket, callback: (data: ChatNotification) => void): () => void {
	socket.on("chat_user_joined", callback);
	console.log("[onUserJoined] callback:", callback);

	return () => {
		socket.off("chat_user_joined", callback);
	};
}