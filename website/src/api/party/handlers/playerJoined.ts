import { Socket } from "socket.io-client";
import { handleGetProfile } from "../../profile/get_profile/handleGetProfile";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export function playerJoinedHandler(socket: Socket) {
	socket.on("player_joined", async (payload: {uuid: string}) => {
		const playerData = await handleGetProfile(payload.uuid);
		useNotificationStore.getState().showNotification(
			`${playerData?.username} joined your party!`,
			NOTIFICATION_TYPE.message
		)

		console.log("[partyStore] 'playerJoined' uuid:", payload.uuid);
	});
}