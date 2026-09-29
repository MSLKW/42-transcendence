import { chatSocket } from "../chatSocket";

export const subscribeToUserJoined = () => {
	return chatSocket.onUserJoined((notif) => {
		console.log("[chat > 'subscribe' onUserJoined] notif:", notif);
	});
};