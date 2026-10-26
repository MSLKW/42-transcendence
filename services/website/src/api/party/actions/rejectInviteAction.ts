import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";

export async function rejectInviteAction(socket: Socket | null, hostUuid: string) {
	if (!socket)
		return;

	try {
		await ensureConnected(socket);

		socket?.emit("reject_invite", { hostUuid });

		useNotificationStore.getState().showNotification(
			"Invitation rejected",
			NOTIFICATION_TYPE.message
		);

		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'emit' reject_invite] hostUuid:", hostUuid);
	} catch (error) {
		useNotificationStore.getState().showNotification(
			"Unable to connect to party socket",
			NOTIFICATION_TYPE.error
		);

		console.warn("[party > 'emit' reject_invite] error:", error);
	}
}