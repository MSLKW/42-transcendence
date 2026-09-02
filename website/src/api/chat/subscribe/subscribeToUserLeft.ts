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
			notif.senderUuid,
			name,
			"",
			`${name} has been removed from party`
		);
		console.log(`[subscribeToUserLeft] uuid:${notif.senderUuid} timestamp:${notif.timestamp}`);
	});
};