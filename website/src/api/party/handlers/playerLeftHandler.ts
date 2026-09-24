import { Socket } from "socket.io-client";
import { handleGetProfile } from "../../profile/get_profile/handleGetProfile";
import { useChatStore } from "../../../store/ChatStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export function playerLeftHandler(socket: Socket) {
	socket.on("player_left", async (payload: {uuid: string}) => {
		try {
			const playerData = await handleGetProfile(payload.uuid);
			useNotificationStore.getState().showNotification(
				`${playerData?.username} left your party`,
				NOTIFICATION_TYPE.message
			)

			const addToCachedChat = useChatStore.getState().addToCachedChat;
			addToCachedChat(
				"REPORT",
				"server",
				"",
				"",
				`${playerData?.username ? playerData?.username : "A player"} left the chat`
			);

			console.log("[partyStore] 'playerLeft' uuid:", payload.uuid);
		} catch (error) {
			console.error("Failed to update player profile:", error);
		}
	});
}