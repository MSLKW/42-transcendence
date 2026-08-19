import { Socket } from "socket.io-client";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export function kickMemberAction(socket: Socket | null, recipientUuid: string, recipientName?: string) {
	const { showNotification } = useNotificationStore.getState();
	if (!socket?.connected) {
		showNotification(
			"Cannot kick member: Socket not connected",
			NOTIFICATION_TYPE.error
		);
		return;
	}
	
	socket?.emit("kick_player", { recipientUuid });
	showNotification(
		`${recipientName} removed from your party`,
		NOTIFICATION_TYPE.message
	);
	console.log("[partySocket] 'kick_player' recipientUuid:", recipientUuid);
}