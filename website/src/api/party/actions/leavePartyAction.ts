import { Socket } from "socket.io-client";
import { useChatStore } from "../../../store/ChatStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";

export function leavePartyAction(socket: Socket | null) {
	const addToCachedChat = useChatStore.getState().addToCachedChat;
	const showNotification = useNotificationStore.getState().showNotification;
	const clientUuid = useProfileStore.getState().clientUuid ?? "";
	const data = useProfileStore.getState().getCachedData(clientUuid);

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
	
	usePartyStore.setState({
		members: [ clientUuid ],
		hostUuid: clientUuid,
	});

	useSceneStore.getState().setShowWindow("profile", false);

	addToCachedChat(
		"REPORT",
		"server",
		"",
		"",
		"You left a party",
	)

	console.log("[partySocket] 'leave_party'");
}