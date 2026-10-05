import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
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
	const cachedData = useProfileStore.getState().cachedData;
	const hostUuid = usePartyStore.getState().hostUuid;

	if (!socket)
		return;

	try {
		await ensureConnected(socket);

		socket?.emit("leave_party");

		await useProfileStore.getState().setCachedData();

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

		showNotification(
			clientUuid === hostUuid ? "You left the party" : `You left ${cachedData[hostUuid ?? ""]?.name}'s party`,
			NOTIFICATION_TYPE.message
		);

		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'emit' leave_party]");
	} catch (error) {
		showNotification(
			"Unable to connect to party socket",
			NOTIFICATION_TYPE.error
		);

		console.warn("[party > 'emit' leave_party] error:", error);
	}
}