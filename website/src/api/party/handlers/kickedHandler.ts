import { Socket } from "socket.io-client";
import { useAuthStore } from "../../../store/AuthStore";
import { useChatStore } from "../../../store/ChatStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";

export function kickedHandler(socket: Socket) {
	socket.on("kicked", (payload: {message: string}) => {
		useNotificationStore.getState().showNotification(
			"You've been kicked from the party",
			NOTIFICATION_TYPE.message
		)

		const addToCachedChat = useChatStore.getState().addToCachedChat;
				addToCachedChat(
					"REPORT",
					"server",
					"",
					"",
					"You've been kicked from the party chat"
				);

		useProfileStore.getState().setCachedData();

		const clientUuid = useAuthStore.getState().clientUuid;
		usePartyStore.setState({
			members: [ clientUuid ],
			hostUuid: clientUuid,
		});

		console.log("[partyStore] 'kicked' message:", payload.message);
	});
}