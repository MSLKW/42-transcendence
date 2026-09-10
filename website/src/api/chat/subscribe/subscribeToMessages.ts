import { chatSocket } from "../chatSocket";
import { useBubbleStore } from "../../../store/BubbleStore";
import { useChatStore } from "../../../store/ChatStore";
import { useProfileStore } from "../../../store/ProfileStore";

export const subscribeToMessages = () => {
	return chatSocket.onMessage((chat) => {
		const addBubble = useBubbleStore.getState().addBubble;
		const addToCachedChat = useChatStore.getState().addToCachedChat;
		const data = useProfileStore.getState().getCachedData(chat.senderUuid);

		addToCachedChat(
			chat.type,
			chat.senderUuid,
			data?.name ?? "Player",
			data?.avatar ?? "avatar-unknown.webp",
			chat.message
		);

		addBubble(chat.senderUuid, chat.type, chat.message);
	});
};