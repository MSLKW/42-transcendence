import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import { fetchGetSettings } from "./fetchGetSettings";

export const handleGetSettings = async (uuid: string) => {
	const { showNotification } = useNotificationStore.getState();

	try {
		const response = await fetchGetSettings(uuid);
		console.log("[handleGetSettings] response:", response);
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handleGetSettings] errorMsg:", errorMsg);
		showNotification(errorMsg, NOTIFICATION_TYPE.error);
	}
}