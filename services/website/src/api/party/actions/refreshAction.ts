import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";

export async function refreshAction (socket: Socket | null) {
	const showNotification = useNotificationStore.getState().showNotification;

	if (!socket)
		return;

	try {
		await ensureConnected(socket);

		socket?.emit("refresh");

		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'emit' refresh]");
	} catch (error) {
		showNotification(
			"Unable to connect to party socket",
			NOTIFICATION_TYPE.error
		);

		console.warn("[party > 'emit' refresh] error:", error);
	}
}