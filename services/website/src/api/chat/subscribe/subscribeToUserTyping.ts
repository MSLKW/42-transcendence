import { chatSocket } from "../chatSocket"
import { useChatStore } from "../../../store/ChatStore";
import { useTypingStore } from "../../../store/TypingStore"

export const subscribeToUserTyping = () => {
	return chatSocket.onUserTyping((notif) => {
		if (useChatStore.getState().chatVerboseMode)
			console.log("[chat > 'subscribe' onUserTyping] notif:", notif);

		useTypingStore.getState().setTyping(
			notif.senderUuid,
			notif.isTyping,
		);
	});
};