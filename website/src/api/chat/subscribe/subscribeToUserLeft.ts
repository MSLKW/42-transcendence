import { chatSocket } from "../chatSocket";
import { usePartyStore } from "../../../store/PartyStore";

export const subscribeToUserLeft = () => {
	return chatSocket.onUserLeft((_notif) => {
		const hostUuid = usePartyStore.getState().hostUuid;
		if (!hostUuid) {
			console.warn("Cannot join room - missing hostUuid");
			return;
		}
		chatSocket.joinRoom(hostUuid);
	});
};