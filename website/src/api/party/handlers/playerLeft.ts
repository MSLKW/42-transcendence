import { Socket } from "socket.io-client";
import { handleGetProfile } from "../../profile/get_profile/handleGetProfile";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export function playerLeftHandler(socket: Socket) {
	socket.on("player_left", async (payload: {uuid: string}) => {
		const playerData = await handleGetProfile(payload.uuid);
		useNotificationStore.getState().showNotification(
			`${playerData?.username} left your party`,
			NOTIFICATION_TYPE.message
		)

		console.log("[partyStore] 'playerLeft' uuid:", payload.uuid);
	});
}