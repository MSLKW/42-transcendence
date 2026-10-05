import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";

export async function startGameSessionAction(socket: Socket | null) {
	if (!socket)
		return;

	try {
		await ensureConnected(socket);

		socket?.emit("start_game_session");

		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'emit' start_game_session]");
	} catch (error) {
		useNotificationStore.getState().showNotification(
			"Unable to connect to party socket",
			NOTIFICATION_TYPE.error
		);

		console.warn("[party > 'emit' start_game_session] error:", error);
	}
}