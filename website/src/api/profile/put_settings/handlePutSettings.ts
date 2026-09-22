import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import { fetchPutSettings } from "./fetchPutSettings";
import type { SettingsValues } from "../../../store/SettingsStore";

export const handlePutSettings = async (settings: SettingsValues) => {
	const { showNotification } = useNotificationStore.getState();

	try {
		const response = await fetchPutSettings(settings);
		console.log("[handlePutSettings] response:", response);
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handlePutSettings] errorMsg:", errorMsg);
		showNotification(errorMsg, NOTIFICATION_TYPE.error);
	}
}