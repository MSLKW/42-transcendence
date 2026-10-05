import { fetchValidate } from "./fetchValidate";
import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import { useAuthStore } from "../../../store/AuthStore";

export const handleValidate = async () => {
	try {
		const response = await fetchValidate();
		if (!response)
			return;

		if (useAuthStore.getState().authVerboseMode)
			console.log("[authentication > 'GET' validate] response:", response);

		useAuthStore.setState({
			isAuthenticated: true,
			clientUuid: response.userId,
		});

		return response;
	} catch(error) {
		useAuthStore.setState({
			isAuthenticated: false,
			clientUuid: null,
		});

		useNotificationStore.getState().showNotification(
			error instanceof Error
			? error.message
			: String(error), NOTIFICATION_TYPE.error
		);

		console.warn("[authentication > 'GET' validate] error:", error);

		return null;
	}
};