import { chatSocket } from "../chatSocket";
import { useBubbleStore } from "../../../store/BubbleStore";
import { useChatStore } from "../../../store/ChatStore";
import { useProfileStore } from "../../../store/ProfileStore";

export const subscribeToMessages = () => {
	return chatSocket.onMessage((chat) => {
		if (useChatStore.getState().chatVerboseMode)
			console.log("[chat > 'subscribe' onMessage] chat:", chat);

		const addBubble = useBubbleStore.getState().addBubble;
		const addToCachedChat = useChatStore.getState().addToCachedChat;
		const cachedData = useProfileStore.getState().cachedData;

		if (chat.type === "MESSAGE") {
			addToCachedChat(
				chat.type,
				chat.senderUuid,
				cachedData[chat.senderUuid ?? ""]?.name ?? "-",
				cachedData[chat.senderUuid ?? ""]?.avatar ?? undefined,
				chat.message
			);
		}

		addBubble(chat.senderUuid, chat.type, chat.message);
	});
};