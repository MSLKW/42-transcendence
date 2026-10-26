import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { fetchFriendRequestsReject } from "./fetchFriendRequestsReject";
import { useFriendsStore } from "../../../store/FriendsStore";

export const handleFriendRequestsReject = async (requestId: string, name: string) => {
	try {
		const response = await fetchFriendRequestsReject(requestId);

		if (useFriendsStore.getState().friendsVerboseMode)
			console.log("[friends > 'POST' friend-requests/", requestId, "/reject] response:", response);

		useNotificationStore.getState().showNotification(`${name}'s friend request rejected`, NOTIFICATION_TYPE.message);
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		useNotificationStore.getState().showNotification(error, NOTIFICATION_TYPE.error);

		console.warn("[friends] > 'POST' friend-requests/", requestId, "/reject] error:", error);
	}
}