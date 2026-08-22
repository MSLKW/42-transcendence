import { Socket } from "socket.io-client";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";

export function leavePartyAction(socket: Socket | null) {
	const { showNotification } = useNotificationStore.getState();
	if (!socket?.connected) {
		showNotification(
			"Cannot leave party: Socket not connected",
			NOTIFICATION_TYPE.error
		);
		return;
	}

	socket?.emit("leave_party");
	showNotification(
		"You left the party",
		NOTIFICATION_TYPE.message
	);

	useProfileStore.getState().setCachedData();
	
	const clientUuid = useProfileStore.getState().clientUuid;
	usePartyStore.setState({
		members: [ clientUuid ],
		hostUuid: clientUuid,
	});

	useSceneStore.getState().setShowWindow("profile", false);

	console.log("[partySocket] 'leave_party'");
}