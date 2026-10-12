import { Socket } from "socket.io-client";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export function refreshAction(socket: Socket | null) {
	const { showNotification } = useNotificationStore.getState();
	if (!socket?.connected) {
		showNotification(
			"Cannot refresh: Socket not connected",
			NOTIFICATION_TYPE.error
		);
		return;
	}
	socket?.emit("refresh");
	console.log("[partySocket] 'refresh'");
}