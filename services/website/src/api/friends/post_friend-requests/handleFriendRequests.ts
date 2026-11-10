import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { fetchFriendRequests } from "./fetchFriendRequests";
import { useFriendsStore } from "../../../store/FriendsStore";
import { handleFriendRequestsSent } from "../get_friend-requests_sent/handleFriendRequestsSent";
import { useAuthStore } from "../../../store/AuthStore";

export const handleFriendRequests = async (senderId: string | null, receiverId: string | null, name: string) => {
	if (!senderId || !receiverId) {
		if (useFriendsStore.getState().friendsVerboseMode)
			console.warn(`[friends > 'POST' friend-requests] missing senderId / receiverId`);
		return;
	}

	try {
		const response = await fetchFriendRequests(senderId, receiverId);

		const clientUuid = useAuthStore.getState().clientUuid;
		void handleFriendRequestsSent(clientUuid)
			.then((requests) => {
				useFriendsStore.setState({ friendRequestSent: requests });
			});

		if (useFriendsStore.getState().friendsVerboseMode)
			console.log("[friends > 'POST' friend-requests] response:", response);

		useNotificationStore.getState().showNotification(`Friend request sent to ${name}`, NOTIFICATION_TYPE.message);
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		useNotificationStore.getState().showNotification(error, NOTIFICATION_TYPE.error);

		if (useFriendsStore.getState().friendsVerboseMode)
			console.warn("[friends] > 'POST' friend-requests] error:", error);
	}
}