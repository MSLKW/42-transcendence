import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import { fetchPutAvatar } from "./fetchPutAvatar";

export const handlePutAvatar = async (avatar: File) => {
	const showNotification = useNotificationStore.getState().showNotification;

	try {
		const response = await fetchPutAvatar(avatar);
		console.log("[handlePutAvatar] response:", response);
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handlePutAvatar] errorMsg:", errorMsg);
		showNotification(errorMsg, NOTIFICATION_TYPE.error);
	}
}