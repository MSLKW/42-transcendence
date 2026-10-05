import { Socket } from "socket.io-client";
import { useChatStore } from "../../../store/ChatStore";

export function sendTypingAction(socket: Socket | null, isTyping: boolean) {
	if (!socket)
		return;

	socket?.emit("chat_typing", { isTyping });

	if (useChatStore.getState().chatVerboseMode)
		console.log("[chat > 'emit' chat_typing] isTyping:", isTyping);
}