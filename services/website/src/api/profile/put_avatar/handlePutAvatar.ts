import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { fetchPutAvatar } from "./fetchPutAvatar";

export const handlePutAvatar = async (avatar: File) => {
	try {
		const response = await fetchPutAvatar(avatar);

		if (useProfileStore.getState().profileVerboseMode)
			console.log("[profile > 'PUT' avatar] response:", response);

		return response;
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		useNotificationStore.getState().showNotification(error, NOTIFICATION_TYPE.error);

		console.warn("[profile > 'PUT' avatar] error:", error);
	}
}