import { chatSocket } from "../chatSocket";
import { useProfileStore } from "../../../store/ProfileStore";
import { useChatStore } from "../../../store/ChatStore";

export const subscribeToMessages = () => {
	return chatSocket.onMessage((chat) => {
		const data = useProfileStore.getState().getCachedData(chat.senderUuid);

		const addToCachedChat = useChatStore.getState().addToCachedChat;
		addToCachedChat(
			"MESSAGE",
			chat.senderUuid,
			data?.name ?? "Player",
			data?.avatar ?? "avatar-unknown.webp",
			chat.message
		);
		console.log(`[subscribeToMessages] uuid:${chat.senderUuid} message:${chat.message} timestamp:${chat.timestamp}`);
	});
};