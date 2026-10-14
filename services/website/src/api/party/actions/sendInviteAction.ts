import { Socket } from "socket.io-client";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export function sendInviteAction(socket: Socket | null, recipientUuid: string, recipientName?: string) {
	const { showNotification } = useNotificationStore.getState();
	if (!socket?.connected) {
		showNotification(
			"Cannot invite player: Socket not connected",
			NOTIFICATION_TYPE.error
		);
		return;
	}

	socket.emit("send_invite", { recipientUuid }, () => {});
	showNotification(
		`Invitation sent to ${recipientName}`,
		NOTIFICATION_TYPE.message
	);
	console.log("[partySocket] 'send_invite' recipientUuid:", recipientUuid);
}