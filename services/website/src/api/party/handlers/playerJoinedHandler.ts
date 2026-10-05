import { Socket } from "socket.io-client";
import { handleGetProfile } from "../../profile/get_profile/handleGetProfile";
import { useChatStore } from "../../../store/ChatStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";

export function playerJoinedHandler(socket: Socket) {
	socket.on("player_joined", async (payload: {uuid: string}) => {
		try {
			const playerData = await handleGetProfile(payload.uuid);
			useNotificationStore.getState().showNotification(
				`${playerData?.username} joined your party!`,
				NOTIFICATION_TYPE.message
			)

			const addToCachedChat = useChatStore.getState().addToCachedChat;
			addToCachedChat(
				"REPORT",
				"server",
				"",
				"",
				`${playerData?.username ? playerData?.username : "A player"} joined the chat`
			);

			if (usePartyStore.getState().partyVerboseMode)
				console.log("[party > 'on' player_joined] uuid:", payload.uuid);
		} catch (error) {
			console.warn("[party > 'on' player_joined] error:", error);
		}
	});
}