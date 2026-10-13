import { useState, useEffect } from "react";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../store/NotificationStore";

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
			console.log("[friends > connected] event.data:", event.data);
		});

		eventSource.addEventListener("replaced", (event) => {
			console.warn("Connection replaced by another tab/device:", event.data);
			eventSource.close();
			setIsConnected(false);
		});

		eventSource.addEventListener("friend_request_received", (event) => {
			const data = JSON.parse(event.data);
			console.warn("New friend request received:", data);
			useNotificationStore.getState().showNotification("New friend request received", NOTIFICATION_TYPE.invite);
		});

		eventSource.addEventListener("friend_request_accepted", (event) => {
			const data = JSON.parse(event.data);
			console.warn("Friend request accepted:", data);
			useNotificationStore.getState().showNotification("Friend request accepted", NOTIFICATION_TYPE.message);
		});

		eventSource.addEventListener("friend_request_rejected", (event) => {
			const data = JSON.parse(event.data);
			console.warn("Friend request rejected:", data);
			useNotificationStore.getState().showNotification("Friend request rejected", NOTIFICATION_TYPE.message);
		});

		eventSource.addEventListener("friends_list_updated", (event) => {
			console.log("Friends list change hinted:", JSON.parse(event.data));
			if (onFriendUpdate)
				onFriendUpdate();
		});

		eventSource.onerror = (error) => {
			console.error("SSE Error / Disconnected:", error);
			setIsConnected(false);
		}

		return () => {
			eventSource.close();
			setIsConnected(false);
			console.log("[friends > return] eventSource.close()");
		};
	}, [clientUuid, onFriendUpdate]);

	return { isConnected };
}