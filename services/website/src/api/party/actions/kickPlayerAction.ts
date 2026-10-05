import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";
import { usePartyStore } from "../../../store/PartyStore";

export async function kickPlayerAction(socket: Socket | null, recipientUuid: string) {
	const { showNotification } = useNotificationStore.getState();

	if (!socket)
		return;

	try {
		await ensureConnected(socket);

		socket?.emit("kick_player", { recipientUuid });

		await useProfileStore.getState().setCachedData();

		useSceneStore.getState().setShowWindow("stats", false);

		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'emit' kick_player] recipientUuid:", recipientUuid);
	} catch (error) {
		showNotification(
			"Unable to connect to party socket",
			NOTIFICATION_TYPE.error
		);

		console.warn("[party > 'emit' kick_player] error:", error);
	}
}