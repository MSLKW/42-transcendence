import { Socket } from "socket.io-client";
import type { ChatMessage } from "../chatSocket";
import { useChatStore } from "../../../store/ChatStore";

export function onMessageAction(socket: Socket, callback: (data: ChatMessage) => void): () => void {
	socket.on("chat_message", callback);

	if (useChatStore.getState().chatVerboseMode)
		console.log("[chat > 'on' chat_message] callback:", callback);

	return () => {
		socket.off("chat_message", callback);

		if (useChatStore.getState().chatVerboseMode)
			console.log("[chat > 'off' chat_message] callback:", callback);
	};
}