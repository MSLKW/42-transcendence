import { Socket } from "socket.io-client";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export function kickedHandler(socket: Socket) {
	socket.on("kicked", (payload: {message: string}) => {
		const { showNotification } = useNotificationStore.getState();
		showNotification(
			`Party disbanded: ${payload.message}`,
			NOTIFICATION_TYPE.message
		)
		console.log("[partyStore] 'kicked' message:", payload.message);
	});
}