import { useTypingStore } from "../../../store/TypingStore"
import { chatSocket } from "../chatSocket"

export const subscribeToUserTyping = () => {
	return chatSocket.onUserTyping((notif) => {
		useTypingStore.getState().setTyping(
			notif.senderUuid,
			notif.isTyping,
		);

		console.log("[chat > 'subscribe' onUserTyping] notif:", notif);
	});
};