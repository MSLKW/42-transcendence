import { chatSocket } from "../chatSocket";
import { useBubbleStore } from "../../../store/BubbleStore";
import { useChatStore } from "../../../store/ChatStore";
import { useProfileStore } from "../../../store/ProfileStore";

export const subscribeToMessages = () => {
	return chatSocket.onMessage((chat) => {
		if (useChatStore.getState().chatVerboseMode)
			console.log("[chat > 'subscribe' onMessage] chat:", chat);

		const cachedProfiles = useProfileStore.getState().cachedProfiles;

		if (chat.type === "MESSAGE") {
			useChatStore.getState().addToCachedChat(
				chat.type,
				chat.senderUuid,
				cachedProfiles[chat.senderUuid ?? ""]?.name ?? "-",
				cachedProfiles[chat.senderUuid ?? ""]?.avatar ?? undefined,
				chat.message
			);
		}

		useBubbleStore.getState().addBubble(chat.senderUuid, chat.type, chat.message);
	});
};