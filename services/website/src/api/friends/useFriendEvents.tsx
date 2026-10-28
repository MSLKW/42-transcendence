import { useState, useEffect } from "react";
import { handleGetProfile } from "../profile/get_profile/handleGetProfile";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../store/NotificationStore";
import { useFriendsStore } from "../../store/FriendsStore";
import { handleFriendRequestsAccept } from "./post_friend-requests_accept/handleFriendRequestsAccept";
import { handleFriendRequestsReject } from "./post_friend-requests_reject/handleFriendRequestsReject";

const friendsUrl = import.meta.env.VITE_API_FRIENDS_PATH;

export function useFriendEvents(clientUuid: string | null, onFriendUpdate?: () => void) {
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		if (!clientUuid) {
			setIsConnected(false);
			return;
		}

		const eventSource = new EventSource(`${friendsUrl}/events`, {
			withCredentials: true
		});

		eventSource.onopen = () => {
			setIsConnected(true);
		};

		eventSource.addEventListener("connected", (event) => {
			if (useFriendsStore.getState().friendsVerboseMode)
				console.log("[friends > connected] event.data:", event.data);
		});

		eventSource.addEventListener("replaced", (event) => {
			if (useFriendsStore.getState().friendsVerboseMode)
				console.warn("[friends > replaced] Connection replaced by another tab/device:", event.data);
			eventSource.close();
			setIsConnected(false);
		});

		eventSource.addEventListener("friend_request_received", (event) => {
			const data = JSON.parse(event.data);
			void handleGetProfile(data.senderId).then((profile) => {
				if (useFriendsStore.getState().friendsVerboseMode)
					console.warn("[friends > friend_request_received] New friend request received:", data);

				useNotificationStore.getState().showNotification(
					`${profile?.username} wants to be friends with you`,
					NOTIFICATION_TYPE.invite,
					data.id,
					() => handleFriendRequestsAccept(data.id, profile?.username ?? "Player"),
					() => handleFriendRequestsReject(data.id, profile?.username ?? "Player")
				);
			});
		});

		eventSource.addEventListener("friend_request_accepted", (event) => {
			const data = JSON.parse(event.data);
			void handleGetProfile(data.by).then((profile) => {
				if (useFriendsStore.getState().friendsVerboseMode)
					console.warn("Friend request accepted:", data);

				const friendRequestSent = useFriendsStore.getState().friendRequestSent;
				const newFriendRequestSent = friendRequestSent.filter((req) => !req.includes(data.by));
				useFriendsStore.setState({ friendRequestSent: newFriendRequestSent });

				useNotificationStore.getState().showNotification(
					`${profile?.username} accepted your friend request`,
					NOTIFICATION_TYPE.message
				);
			});
		});

		eventSource.addEventListener("friend_request_rejected", (event) => {
			const data = JSON.parse(event.data);
			void handleGetProfile(data.by).then((profile) => {
				if (useFriendsStore.getState().friendsVerboseMode)
					console.warn("[friends > friend_request_rejected] Friend request rejected:", data);

				const friendRequestSent = useFriendsStore.getState().friendRequestSent;
				const newFriendRequestSent = friendRequestSent.filter((req) => !req.includes(data.by));
				useFriendsStore.setState({ friendRequestSent: newFriendRequestSent });

				useNotificationStore.getState().showNotification(
					`${profile?.username} rejected your friend request`,
					NOTIFICATION_TYPE.message
				);
			});
		});

		eventSource.addEventListener("friends_list_updated", (event) => {
			if (useFriendsStore.getState().friendsVerboseMode)
				console.log("[friends > friends_list_updated] Friends list change hinted:", JSON.parse(event.data));
			if (onFriendUpdate)
				onFriendUpdate();
		});

		eventSource.onerror = (error) => {
			if (useFriendsStore.getState().friendsVerboseMode)
				console.warn("[friends > onerror] SSE Error / Disconnected:", error);
			setIsConnected(false);
		}

		return () => {
			eventSource.close();
			setIsConnected(false);
			if (useFriendsStore.getState().friendsVerboseMode)
				console.log("[friends > return] eventSource.close()");
		};
	}, [clientUuid, onFriendUpdate]);

	return { isConnected };
}