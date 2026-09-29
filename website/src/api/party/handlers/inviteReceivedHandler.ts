import { Socket } from "socket.io-client";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { partySocket } from "../partySocket";
import { handleGetProfile } from "../../profile/get_profile/handleGetProfile";
import { usePartyStore } from "../../../store/PartyStore";

export function inviteReceivedHandler(socket: Socket) {
	socket.on("invite_received", async (payload: { hostUuid: string }) => {
		try {
			const hostData = await handleGetProfile(payload.hostUuid);

			useNotificationStore.getState().showNotification(
				`${hostData?.username ?? "A player"} invited you to their party!`,
				NOTIFICATION_TYPE.invite,
				() => partySocket.acceptInvite(payload.hostUuid),
				() => partySocket.rejectInvite(payload.hostUuid)
			);

			if (usePartyStore.getState().partyVerboseMode)
				console.log("[party > 'on' invite_received] hostUuid:", payload.hostUuid);
		} catch (error) {
			console.warn("[party > 'on' invite_received] error:", error);
		}
	});
}