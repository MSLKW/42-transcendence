import { Socket } from "socket.io-client";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { partySocket } from "../partySocket";
import { handleGetProfile } from "../../profile/get_profile/handleGetProfile";

export function inviteReceivedHandler(socket: Socket) {
	socket.on("invite_received", async (payload: { hostUuid: string }) => {
		const hostData = await handleGetProfile(payload.hostUuid);

		const { showNotification } = useNotificationStore.getState();
		showNotification(
			`${hostData?.username ?? "A player"} invited you to their party!`,
			NOTIFICATION_TYPE.invite,
			() => partySocket.acceptInvite(payload.hostUuid),
			() => partySocket.rejectInvite(payload.hostUuid)
		)
		console.log("[partySocket] `invite_received` hostUuid:", payload.hostUuid);
	});
}