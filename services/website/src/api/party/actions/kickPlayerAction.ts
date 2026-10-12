import { Socket } from "socket.io-client";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";

export async function kickPlayerAction(socket: Socket | null, recipientUuid: string) {
	const { showNotification } = useNotificationStore.getState();
	if (!socket?.connected) {
		showNotification(
			"Cannot kick member: Socket not connected",
			NOTIFICATION_TYPE.error
		);
		return;
	}

	socket?.emit("kick_player", { recipientUuid });

	usePartyStore.getState().kickPlayer(recipientUuid);

	await useProfileStore.getState().setCachedData();

	useSceneStore.getState().setShowWindow("stats", false);

	console.log("[partySocket] 'kick_player' recipientUuid:", recipientUuid);
}