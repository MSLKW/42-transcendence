import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export async function rejectInviteAction(socket: Socket | null, hostUuid: string) {
	const { showNotification } = useNotificationStore.getState();

	if (!socket)
		return;

	try {
		await ensureConnected(socket);

		socket?.emit("reject_invite", { hostUuid });
		showNotification(
			"Invitation rejected",
			NOTIFICATION_TYPE.message
		);
		console.log("[partySocket] 'reject_invite' hostUuid:", hostUuid);
	} catch (error) {
		showNotification(
			"Unable to connect to party socket",
			NOTIFICATION_TYPE.error
		);
		console.error("Unable to connect to party socket:", error);
	}
}