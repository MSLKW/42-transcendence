import { chatSocket } from "../chatSocket";
import { useBubbleStore } from "../../../store/BubbleStore";
import { useChatStore } from "../../../store/ChatStore";
import { useProfileStore } from "../../../store/ProfileStore";

export const subscribeToMessages = () => {
	return chatSocket.onMessage((chat) => {
		const addBubble = useBubbleStore.getState().addBubble;
		const addToCachedChat = useChatStore.getState().addToCachedChat;
		const clientUuid = useProfileStore.getState().clientUuid;
		const data = useProfileStore.getState().getCachedData(chat.senderUuid);

		addToCachedChat(
			"MESSAGE",
			chat.senderUuid,
			data?.name ?? "Player",
			data?.avatar ?? "avatar-unknown.webp",
			chat.message
		);

		// if (chat.senderUuid != clientUuid)
			addBubble(chat.senderUuid, chat.message);

		console.log(`[subscribeToMessages] uuid:${chat.senderUuid} message:${chat.message} timestamp:${chat.timestamp}`);
	});
};