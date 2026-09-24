import { Socket } from "socket.io-client";
import type { ChatRateLimited } from "../chatSocket";

export function onRateLimitedAction(socket: Socket, callback: (data: ChatRateLimited) => void): () => void {
	socket.on("chat_rate_limited", callback);
	console.log("[onRateLimited] callback:", callback);

	return () => {
		socket.off("chat_rate_limited", callback);
	};
}