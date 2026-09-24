import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export async function sendChatAction(socket: Socket | null, chatType: string, message: string) {
	const showNotification = useNotificationStore.getState().showNotification;

	if (!socket)
		return;

	try {
		const trimmedMessage = message.trim();
		if (!trimmedMessage)
			return;

		await ensureConnected(socket);

		socket.emit("chat_message", { type: chatType, message: trimmedMessage } );
		console.log("[sendChat] type:", chatType, " message:", trimmedMessage);
	} catch (error) {
		showNotification(
			"Message could not be sent. Please try again.",
			NOTIFICATION_TYPE.error
		);
		console.error("Message could not be sent:", error);
	}
}