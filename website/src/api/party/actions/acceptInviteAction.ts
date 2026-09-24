import { Socket } from "socket.io-client";
import { ensureConnected } from "../../../utilities/websockets/ensureConnected";
import { useChatStore } from "../../../store/ChatStore";
import { handleGetProfile } from "../../profile/get_profile/handleGetProfile";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export async function acceptInviteAction(socket: Socket | null, hostUuid: string) {
	const addToCachedChat = useChatStore.getState().addToCachedChat;
	const showNotification = useNotificationStore.getState().showNotification;

	if (!socket)
		return;

	try {
		await ensureConnected(socket);

		socket?.emit("accept_invite", { hostUuid }, (response: any) => {
			if (!response.success)
				console.log("Failed to accept:", response.reason);
		});

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
			"Unable to connect to party server",
			NOTIFICATION_TYPE.error
		);
		console.error("Unable to connect to party socket:", error);
	}
}