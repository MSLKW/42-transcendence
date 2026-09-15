import { fetchOnline } from "./fetchOnline";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";

export const handleOnline = async (uuid: string) => {
	const { showNotification } = useNotificationStore.getState();

	try {
		const response = await fetchOnline(uuid);
		console.log("[handleOnline] response.id:", response.id);
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handleOnline] errorMsg:", errorMsg);
		showNotification(errorMsg, NOTIFICATION_TYPE.error);
	}
}
