import { Socket } from "socket.io-client";
import type { AcceptInviteResponse } from "../partySocket";
import { handleGetProfile } from "../../profile/get_profile/handleGetProfile";
import { useChatStore } from "../../../store/ChatStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";

function emitAcceptInvite(socket: Socket, hostUuid: string): Promise<AcceptInviteResponse> {
	return new Promise((resolve) => {
		socket.emit(
			"accept_invite",
			{ hostUuid },
			(response: AcceptInviteResponse) => { resolve(response) }
		);
	});
}

export async function acceptInviteAction(socket: Socket | null, hostUuid: string) {
	if (!socket)
		return;

	try {
		await ensureConnected(socket);

		const response = await emitAcceptInvite(socket, hostUuid);
		if (!response.success) {
			useNotificationStore.getState().showNotification(response.reason ?? "Failed to join party", NOTIFICATION_TYPE.error);
			console.warn("[party > 'emit' accept_invite] reason:Failed to join party");
			return;
		}

		const hostData = await handleGetProfile(hostUuid);

		useNotificationStore.getState().showNotification(
			`You just joined ${hostData?.username ?? "a player"}'s party!`,
			NOTIFICATION_TYPE.message
		);

		useChatStore.getState().addToCachedChat(
			"REPORT",
			"server",
			"",
			"",
			`You joined ${hostData?.username ? hostData?.username : "a"}'s chat`,
		)

		if (usePartyStore.getState().partyVerboseMode)
			console.log("[party > 'emit' accept_invite] hostUuid:", hostUuid);
	} catch (error) {
		useNotificationStore.getState().showNotification(
			"Unable to connect to party socket",
			NOTIFICATION_TYPE.error
		);

		console.warn("[party > 'emit' accept_invite] error:", error);
	}
}