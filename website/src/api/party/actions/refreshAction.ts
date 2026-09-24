import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export async function refreshAction (socket: Socket | null) {
	const showNotification = useNotificationStore.getState().showNotification;

	if (!socket)
		return;

	try {
		await ensureConnected(socket);

		socket?.emit("refresh");
		console.log("[partySocket] 'refresh'");
	} catch (error) {
		showNotification(
			"Unable to connect to party server",
			NOTIFICATION_TYPE.error
		);
		console.error("Unable to connect to party socket:", error);
	}
}