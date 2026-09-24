import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export async function startGameSessionAction(socket: Socket | null) {
	const { showNotification } = useNotificationStore.getState();

	if (!socket)
		return;

	try {
		await ensureConnected(socket);

		socket?.emit("start_game_session");
		console.log("[partySocket] 'start_game_session'");
	} catch (error) {
		showNotification(
			"Unable to connect to party socket",
			NOTIFICATION_TYPE.error
		);
		console.error("Unable to connect to party socket:", error);
	}
}