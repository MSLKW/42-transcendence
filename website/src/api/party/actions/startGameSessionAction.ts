import { Socket } from "socket.io-client";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export function startGameSessionAction(socket: Socket | null) {
	const { showNotification } = useNotificationStore.getState();
	if (!socket?.connected) {
		showNotification(
			"Cannot start game session: Socket not connected",
			NOTIFICATION_TYPE.error
		);
		return;
	}
	socket?.emit("start_game_session");
	console.log("[partySocket] 'start_game_session'");
}