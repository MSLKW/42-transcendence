import { Socket } from "socket.io-client";
// import { chatSocket } from "../../chat/chatSocket";
import { useChatStore } from "../../../store/ChatStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";

export function kickPlayerAction(socket: Socket | null, recipientUuid: string) {
	const { showNotification } = useNotificationStore.getState();
	const addToCachedChat = useChatStore.getState().addToCachedChat;
	const data = useProfileStore.getState().getCachedData(recipientUuid);
	
	if (!socket?.connected) {
		showNotification(
			"Cannot kick member: Socket not connected",
			NOTIFICATION_TYPE.error
		);
		return;
	}

	socket?.emit("kick_player", { recipientUuid });

	// chatSocket.disconnect();
	// chatSocket.joinRoom(useProfileStore.getState().clientUuid!);

	usePartyStore.getState().kickPlayer(recipientUuid);

	useProfileStore.getState().setCachedData();

	useSceneStore.getState().setShowWindow("stats", false);

	addToCachedChat(
		"REPORT",
		"server",
		"",
		"",
		`${data?.name ?? "A player"} removed from party`
	);

	console.log("[partySocket] 'kick_player' recipientUuid:", recipientUuid);
}