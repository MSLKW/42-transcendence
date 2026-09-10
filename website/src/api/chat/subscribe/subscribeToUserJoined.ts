import { chatSocket } from "../chatSocket";
import { useProfileStore } from "../../../store/ProfileStore";
import { useChatStore } from "../../../store/ChatStore";

export const subscribeToUserJoined = () => {
	return chatSocket.onUserJoined((notif) => {
		const data = useProfileStore.getState().getCachedData(notif.senderUuid);
		const name = data?.name ?? "A player";

		const addToCachedChat = useChatStore.getState().addToCachedChat;
		addToCachedChat(
			"REPORT",
			"server",
			"",
			"",
			`${name} has joined your chat`
		);
	});
};