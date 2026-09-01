import { Socket } from "socket.io-client";
import { chatSocket } from "../../chat/chatSocket";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";

export function kickMemberAction(socket: Socket | null, recipientUuid: string, recipientName?: string) {
	const { showNotification } = useNotificationStore.getState();
	if (!socket?.connected) {
		showNotification(
			"Cannot kick member: Socket not connected",
			NOTIFICATION_TYPE.error
		);
		return;
	}

	socket?.emit("kick_player", { recipientUuid });
	showNotification(
		`${recipientName} removed from your party`,
		NOTIFICATION_TYPE.message
	);

	chatSocket.disconnect();

	usePartyStore.getState().kickMember(recipientUuid);

	useProfileStore.getState().setCachedData();

	useSceneStore.getState().setShowWindow("stats", false);

	console.log("[partySocket] 'kick_player' recipientUuid:", recipientUuid);
}