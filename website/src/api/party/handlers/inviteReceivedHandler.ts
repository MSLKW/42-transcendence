import { Socket } from "socket.io-client";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { partySocket } from "../partySocket";

export function inviteReceivedHandler(socket: Socket) {
	socket.on("invite_received", (payload: { hostUuid: string, hostName?: string }) => {
		const { showNotification } = useNotificationStore.getState();
		showNotification(
			`${payload.hostName || "A player"} invited you to their party!`,
			NOTIFICATION_TYPE.invite,
			() => partySocket.acceptInvite(payload.hostUuid),
			() => partySocket.rejectInvite(payload.hostUuid)
		)
		console.log("[partySocket] `invite_received` hostUuid:", payload.hostUuid);
	});

}