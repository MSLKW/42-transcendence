import { Socket } from "socket.io-client";
import { useChatStore } from "../../../store/ChatStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export function acceptInviteAction(socket: Socket | null, hostUuid: string) {
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

	showNotification(
		"You just joined a party!",
		NOTIFICATION_TYPE.message
	);

	addToCachedChat(
		"REPORT",
		"server",
		"",
		"",
		"You joined a party!",
	)

	useChatStore.setState({ chatRoomId: hostUuid });
	console.log("[partySocket] 'accept_invite' hostUuid:", hostUuid);
}