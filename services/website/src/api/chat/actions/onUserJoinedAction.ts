import { Socket } from "socket.io-client";
import type { ChatNotification } from "../chatSocket";
import { useChatStore } from "../../../store/ChatStore";

export function onUserJoinedAction(socket: Socket, callback: (data: ChatNotification) => void): () => void {
	socket.on("chat_user_joined", callback);

	if (useChatStore.getState().chatVerboseMode)
		console.log("[chat > 'on' chat_user_joined] callback:", callback);

	return () => {
		socket.off("chat_user_joined", callback);

		if (useChatStore.getState().chatVerboseMode)
			console.log("[chat > 'off' chat_user_joined] callback:", callback);
	};
}