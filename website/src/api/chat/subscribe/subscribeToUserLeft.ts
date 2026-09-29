import { chatSocket } from "../chatSocket";
import { usePartyStore } from "../../../store/PartyStore";

export const subscribeToUserLeft = () => {
	return chatSocket.onUserLeft((notif) => {
		const hostUuid = usePartyStore.getState().hostUuid;
		if (!hostUuid) {
			console.warn("[chat > 'subscribe' onUserLeft] error: Cannot join room - missing hostUuid");
			return;
		}

		chatSocket.joinRoom(hostUuid);

		console.log("[chat > 'subscribe' onUserLeft] notif:", notif);
	});
};