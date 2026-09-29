import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
import { useChatStore } from "../../../store/ChatStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export async function joinRoomAction(socket: Socket | null, roomId: string) {
	if (!socket)
		return;

	try {
		await ensureConnected(socket);

		socket.emit("chat_join_room", { roomId: roomId });
		useChatStore.setState({ chatRoomId: roomId });

		if (useChatStore.getState().chatVerboseMode)
			console.log(`[chat > 'emit' chat_join_room] roomId: ${roomId}`);
	} catch (error) {
		useNotificationStore.getState().showNotification(
			"Unable to connect to chat socket",
			NOTIFICATION_TYPE.error
		);

		console.warn("[chat > 'emit' chat_join_room] error:", error);
	}
}