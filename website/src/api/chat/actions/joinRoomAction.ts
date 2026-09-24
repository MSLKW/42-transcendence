import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
import { useChatStore } from "../../../store/ChatStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export async function joinRoomAction(socket: Socket | null, roomId: string) {
	const showNotification = useNotificationStore.getState().showNotification;

	if (!socket)
		return;

	try {
		await ensureConnected(socket);

		socket.emit("chat_join_room", { roomId: roomId });
		useChatStore.setState({ chatRoomId: roomId });
		console.log(`[chatSocket] Emitted join for party room: ${roomId}`);
	} catch (error) {
		showNotification(
			"Unable to connect to chat socket",
			NOTIFICATION_TYPE.error
		);
		console.error("Unable to connect to chat socket:", error);
	}
}