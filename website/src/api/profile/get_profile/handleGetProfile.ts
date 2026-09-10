import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import type { UserData } from "../../../store/ProfileStore";
import { fetchGetProfile } from "./fetchGetProfile";

export const handleGetProfile = async (uuid: string): Promise<UserData | null> => {
	const { showNotification } = useNotificationStore.getState();

	try {
		const response = await fetchGetProfile(uuid);
		console.log("[handleGetProfile] response:", response);
		return response;
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handleGetProfile] errorMsg:", errorMsg);
		showNotification(errorMsg, NOTIFICATION_TYPE.error);
		return null;
	}
}