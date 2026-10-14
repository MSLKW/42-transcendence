import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { fetchFriendRequestsAccept } from "./fetchFriendRequestsAccept";
import { useFriendsStore } from "../../../store/FriendsStore";

export const handleFriendRequestsAccept = async (requestId: string) => {
	try {
		const response = await fetchFriendRequestsAccept(requestId);

		if (useFriendsStore.getState().friendsVerboseMode)
			console.log("[friends > 'POST' friend-requests/", requestId, "/accept] response:", response);

		useNotificationStore.getState().showNotification("Friend request accepted", NOTIFICATION_TYPE.message);
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		useNotificationStore.getState().showNotification(error, NOTIFICATION_TYPE.error);

		console.warn("[friends] > 'POST' friend-requests/", requestId, "/accept] error:", error);
	}
}