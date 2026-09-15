import { chatSocket } from "../chatSocket";

export const subscribeToUserJoined = () => {
	return chatSocket.onUserJoined((_notif) => {
		console.log("[subscribeToUserJoined]");
	});
};