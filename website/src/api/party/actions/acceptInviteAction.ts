import { Socket } from "socket.io-client";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export function acceptInviteAction(socket: Socket | null, hostUuid: string) {
	const { showNotification } = useNotificationStore.getState();
	if (!socket?.connected) {
		showNotification(
			"Cannot accept invite: Socket not connected",
			NOTIFICATION_TYPE.error
		);
		return;
	}

	socket?.emit("accept_invite", { hostUuid }, (response: any) => {
		if (!response.success)
			console.log("Failed to accept:", response.reason);
	});
	showNotification(
		"You just joined a party!",
		NOTIFICATION_TYPE.message
	);
	console.log("[partySocket] 'accept_invite' hostUuid:", hostUuid);
}