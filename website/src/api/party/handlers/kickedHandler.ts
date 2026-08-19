import { Socket } from "socket.io-client";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useSceneStore } from "../../../store/SceneStore";

export function kickedHandler(socket: Socket) {
	socket.on("kicked", (payload: {message: string}) => {
		const { showNotification } = useNotificationStore.getState();
		usePartyStore.getState().set1PlayerParty();
		useSceneStore.getState().setShowWindow("profile", false);
		showNotification(
			`Party disbanded: ${payload.message}`,
			NOTIFICATION_TYPE.message
		)
		console.log("[partyStore] 'kicked' message:", payload.message);
	});
}