import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { fetchPutProfile } from "./fetchPutProfile";

export const handlePutProfile = async (username: string, avatarPath: string, badge: string) => {
	try {
		const response = await fetchPutProfile(username, avatarPath, badge);

		if (!response.ok)
			throw new Error("Name taken. Try a different name");

		if (useProfileStore.getState().profileVerboseMode)
			console.log("[profile > 'PUT' profile] response:", response);

		return response;
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		useNotificationStore.getState().showNotification(error, NOTIFICATION_TYPE.error);

		console.warn("[profile > 'PUT' profile] error:", error);

		throw err;
	}
}