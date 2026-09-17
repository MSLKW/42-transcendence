import { Socket } from "socket.io-client";
import { useAuthStore } from "../../../store/AuthStore";
import { useChatStore } from "../../../store/ChatStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";

export function leavePartyAction(socket: Socket | null) {
	const clientUuid = useAuthStore.getState().clientUuid ?? "";
	const addToCachedChat = useChatStore.getState().addToCachedChat;
	const showNotification = useNotificationStore.getState().showNotification;

	if (!socket?.connected) {
		showNotification(
			"Cannot leave party: Socket not connected",
			NOTIFICATION_TYPE.error
		);
		return;
	}

	const cachedData = useProfileStore.getState().cachedData;
	const hostUuid = usePartyStore.getState().hostUuid;
	const hostData = cachedData.find(d => d.uuid === hostUuid);
	socket?.emit("leave_party");
	showNotification(
		clientUuid === hostUuid ? "You left the party" : `You left ${hostData?.name}'s party`,
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
		`You left ${
			(hostData?.uuid != clientUuid && hostData?.name) ? hostData?.name + "'s" :
			"the party"
		} chat`,
	)

	console.log("[partySocket] 'leave_party'");
}