import { Socket } from "socket.io-client";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export function rejectInviteAction(socket: Socket | null, hostUuid: string) {
	const { showNotification } = useNotificationStore.getState();
		if (!socket?.connected) {
			showNotification(
				"Cannot reject invite: Socket not connected",
				NOTIFICATION_TYPE.error
			);
			return;
		}

		socket?.emit("reject_invite", { hostUuid });
		showNotification(
			"Invitation rejected",
			NOTIFICATION_TYPE.message
		);
	console.log("[partySocket] 'reject_invite' hostUuid:", hostUuid);
}