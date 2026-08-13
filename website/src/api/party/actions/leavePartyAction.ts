import { Socket } from "socket.io-client";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export function leavePartyAction(socket: Socket | null) {
	const { showNotification } = useNotificationStore.getState();
	if (!socket?.connected) {
		showNotification(
			"Cannot leave party: Socket not connected",
			NOTIFICATION_TYPE.error
		);
		return;
	}

	socket?.emit("leave_party");
	showNotification(
		"You left the party",
		NOTIFICATION_TYPE.message
	);
	console.log("[partySocket] 'leave_party'");
}