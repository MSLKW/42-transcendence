import { Socket } from "socket.io-client";
import type { ChatRateLimited } from "../chatSocket";
import { useChatStore } from "../../../store/ChatStore";

export function onRateLimitedAction(socket: Socket, callback: (data: ChatRateLimited) => void): () => void {
	socket.on("chat_rate_limited", callback);

	if (useChatStore.getState().chatVerboseMode)
		console.log("[chat > 'on' chat_rate_limited] callback:", callback);

	return () => {
		socket.off("chat_rate_limited", callback);

		if (useChatStore.getState().chatVerboseMode)
			console.log("[chat > 'off' chat_rate_limited] callback:", callback);
	};
}