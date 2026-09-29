import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { useChatStore } from "../../../store/ChatStore";

export async function sendChatAction(socket: Socket | null, chatType: string, message: string) {
	if (!socket)
		return;

	try {
		const trimmedMessage = message.trim();
		if (!trimmedMessage)
			return;

		await ensureConnected(socket);

		socket.emit("chat_message", { type: chatType, message: trimmedMessage } );

		if (useChatStore.getState().chatVerboseMode)
			console.log("[chat > 'emit' chat_message] type:", chatType, " message:", trimmedMessage);
	} catch (error) {
		useNotificationStore.getState().showNotification(
			"Failed to send message",
			NOTIFICATION_TYPE.error
		);

		console.warn("[chat > 'emit' chat_message] error:", error);
	}
}