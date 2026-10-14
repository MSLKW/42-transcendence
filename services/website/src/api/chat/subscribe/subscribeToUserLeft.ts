import { chatSocket } from "../chatSocket";
import { useChatStore } from "../../../store/ChatStore";
import { usePartyStore } from "../../../store/PartyStore";

export const subscribeToUserLeft = () => {
	return chatSocket.onUserLeft((notif) => {
		const hostUuid = usePartyStore.getState().hostUuid;
		if (!hostUuid) {
			console.warn("[chat > 'subscribe' onUserLeft] error: Cannot join room - missing hostUuid");
			return;
		}

		if (useChatStore.getState().chatVerboseMode)
			console.log("[chat > 'subscribe' onUserLeft] notif:", notif);
	});
};