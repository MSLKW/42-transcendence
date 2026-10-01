import { chatSocket } from "../chatSocket";
import { useChatStore } from "../../../store/ChatStore";

export const subscribeToUserJoined = () => {
	return chatSocket.onUserJoined((notif) => {
		if (useChatStore.getState().chatVerboseMode)
			console.log("[chat > 'subscribe' onUserJoined] notif:", notif);
	});
};