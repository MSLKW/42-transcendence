import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
import { useChatStore } from "../../../store/ChatStore";
import { handleGetProfile } from "../../profile/get_profile/handleGetProfile";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import type { AcceptInviteResponse } from "../partySocket";

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
	const addToCachedChat = useChatStore.getState().addToCachedChat;
	const showNotification = useNotificationStore.getState().showNotification;

	if (!socket)
		return;

	try {
		await ensureConnected(socket);

		const response = await emitAcceptInvite(socket, hostUuid);
		if (!response.success) {
			showNotification(response.reason ?? "Unable to join party", NOTIFICATION_TYPE.error);
			console.log("Failed to accept:", response.reason);
			return;
		}

		const hostData = await handleGetProfile(hostUuid);
		showNotification(
			`You just joined ${hostData?.username ?? "a player"}'s party!`,
			NOTIFICATION_TYPE.message
		);

		addToCachedChat(
			"REPORT",
			"server",
			"",
			"",
			`You joined ${hostData?.username ? hostData?.username : "a"}'s chat`,
		)

		useChatStore.setState({ chatRoomId: hostUuid });
		console.log("[partySocket] 'accept_invite' hostUuid:", hostUuid);
	} catch (error) {
		showNotification(
			"Unable to connect to party socket",
			NOTIFICATION_TYPE.error
		);
		console.error("Unable to connect to party socket:", error);
	}
}