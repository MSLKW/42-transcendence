import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
import { useChatStore } from "../../../store/ChatStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export async function joinRoomAction(socket: Socket | null, roomId: string) {
	if (!socket)
		return;

	try {
		await ensureConnected(socket);

		const response = await new Promise<{
			success: boolean;
			roomId?: string;
			reason?: string;
		}>((resolve) => {
			socket.emit("chat_join_room", { roomId: roomId }, resolve);
		})
		if (!response.success) {
			useNotificationStore.getState().showNotification(
				response.reason ?? "Unable to join chat room",
				NOTIFICATION_TYPE.error
			);
			return;
		}

		useChatStore.setState({ chatRoomId: response.roomId ?? roomId });

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