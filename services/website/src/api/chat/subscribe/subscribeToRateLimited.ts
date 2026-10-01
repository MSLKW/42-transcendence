import { useChatStore } from "../../../store/ChatStore"
import { chatSocket } from "../chatSocket"

export const subscribeToRateLimited = () => {
	return chatSocket.onRateLimited((notif) => {
		if (useChatStore.getState().chatVerboseMode)
			console.log("[chat > 'subscribe' onRateLimited] notif:", notif);

		useChatStore.getState().showRateLimited(notif.message);
	});
};