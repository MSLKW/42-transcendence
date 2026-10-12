import { Socket } from "socket.io-client";
import { useAuthStore } from "../../../store/AuthStore";
import { useChatStore } from "../../../store/ChatStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";

export async function leavePartyAction(socket: Socket | null) {
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
	socket?.emit("leave_party");
	showNotification(
		clientUuid === hostUuid ? "You left the party" : `You left ${cachedData[hostUuid ?? ""]?.name}'s party`,
		NOTIFICATION_TYPE.message
	);

	await useProfileStore.getState().setCachedData();
	
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
			(hostUuid != clientUuid && cachedData[hostUuid ?? ""]?.name) ? cachedData[hostUuid ?? ""]?.name + "'s" :
			"the party"
		} chat`,
	)

	console.log("[partySocket] 'leave_party'");
}