import { Socket } from "socket.io-client";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";

export function kickedHandler(socket: Socket) {
	socket.on("kicked", (payload: {message: string}) => {
		useNotificationStore.getState().showNotification(
			`Party disbanded: ${payload.message}`,
			NOTIFICATION_TYPE.message
		)

		useProfileStore.getState().setCachedData();

		const clientUuid = useProfileStore.getState().clientUuid;
		usePartyStore.setState({
			members: [ clientUuid ],
			hostUuid: clientUuid,
		});

		console.log("[partyStore] 'kicked' message:", payload.message);
	});
}