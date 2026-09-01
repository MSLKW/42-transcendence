import { chatSocket } from "../chatSocket";
import { useProfileStore } from "../../../store/ProfileStore";
import { useChatStore } from "../../../store/ChatStore";

export const subscribeToUserLeft = () => {
	return chatSocket.onUserLeft((notif) => {
		const data = useProfileStore.getState().getCachedData(notif.senderUuid);
		const name = data?.name ?? "A player";

		const addToCachedChat = useChatStore.getState().addToCachedChat;
		addToCachedChat(
			"NOTIFICATION",
			notif.senderUuid,
			name,
			"",
			`${name} has left your party!`
		);
		console.log(`[subscribeToUserLeft] uuid:${notif.senderUuid} timestamp:${notif.timestamp}`);
	});
};