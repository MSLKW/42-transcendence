import { useChatStore } from "../../../store/ChatStore"
import { chatSocket } from "../chatSocket"

export const subscribeToRateLimited = () => {
	return chatSocket.onRateLimited((notif) => {
		useChatStore.getState().showRateLimitMessage(notif.message);
	});
};