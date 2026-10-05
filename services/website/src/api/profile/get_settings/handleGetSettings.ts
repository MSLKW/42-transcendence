import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { fetchGetSettings } from "./fetchGetSettings";

export const handleGetSettings = async (uuid: string) => {
	try {
		const response = await fetchGetSettings(uuid);

		if (useProfileStore.getState().profileVerboseMode)
			console.log(`[profile > 'GET' settings/${uuid}] response:`, response);

		return response;
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		useNotificationStore.getState().showNotification(error, NOTIFICATION_TYPE.error);

		console.warn(`[profile > 'GET' settings/${uuid}] error:${error}`);

		return null;
	}
}