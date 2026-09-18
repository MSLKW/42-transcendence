import { Socket } from "socket.io-client";
import { useChatStore } from "../../../store/ChatStore";
import { handleGetProfile } from "../../profile/get_profile/handleGetProfile";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export async function acceptInviteAction(socket: Socket | null, hostUuid: string) {
	const addToCachedChat = useChatStore.getState().addToCachedChat;
	const showNotification = useNotificationStore.getState().showNotification;

	if (!socket?.connected) {
		showNotification(
			"Cannot accept invite: Socket not connected",
			NOTIFICATION_TYPE.error
		);
		return;
	}

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
}