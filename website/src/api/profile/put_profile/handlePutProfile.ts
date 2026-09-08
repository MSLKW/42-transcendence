import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import { fetchPutProfile } from "./fetchPutProfile";

export const handlePutProfile = async (username: string, avatarPath: string, badge: string) => {
	const { showNotification } = useNotificationStore.getState();

	try {
		const response = await fetchPutProfile(username, avatarPath, badge);
		// const resp_json = await response?.json();
		console.log("[handlePutProfile] response:", response);
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handlePutProfile] errorMsg:", errorMsg);
		showNotification(errorMsg, NOTIFICATION_TYPE.error);
	}
}