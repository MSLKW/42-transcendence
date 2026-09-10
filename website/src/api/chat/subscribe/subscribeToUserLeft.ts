import { chatSocket } from "../chatSocket";
import { useProfileStore } from "../../../store/ProfileStore";
import { useChatStore } from "../../../store/ChatStore";

export const subscribeToUserLeft = () => {
	return chatSocket.onUserLeft((notif) => {
		const data = useProfileStore.getState().getCachedData(notif.senderUuid);
		const name = data?.name ?? "A player";

		const addToCachedChat = useChatStore.getState().addToCachedChat;
		addToCachedChat(
			"REPORT",
			"server",
			"",
			"",
			`${name} has left the chat`
		);

		const clientUuid = useProfileStore.getState().clientUuid;
		if (!clientUuid) {
			console.warn("Cannot join room - missing clientUuid");
			return;
		}
		chatSocket.joinRoom(clientUuid);
	});
};