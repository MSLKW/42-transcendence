import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import { fetchPutSettings } from "./fetchPutSettings";
import type { SettingsValues } from "../../../store/SettingsStore";
import { useProfileStore } from "../../../store/ProfileStore";

export const handlePutSettings = async (settings: SettingsValues) => {
	try {
		const response = await fetchPutSettings(settings);

		if (useProfileStore.getState().profileVerboseMode)
			console.log("[profile > 'PUT' settings] response:", response);
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		useNotificationStore.getState().showNotification(error, NOTIFICATION_TYPE.error);

		console.warn("[profile > 'PUT' settings] error:", error);
	}
}