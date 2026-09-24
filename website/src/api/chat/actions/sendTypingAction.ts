import { Socket } from "socket.io-client";

export function sendTypingAction(socket: Socket | null, isTyping: boolean) {
	if (!socket)
		return;

	console.log("[sendTyping] isTyping:", isTyping);
	socket?.emit("chat_typing", { isTyping });
}