import { fetchValidate } from "./fetchValidate";
import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import { useSceneStore } from "../../../store/SceneStore";
import { useAuthStore } from "../../../store/AuthStore";

export const handleValidate = async () => {
	try {
		const response = await fetchValidate();
		if (!response)
			return;

		if (useAuthStore.getState().authVerboseMode)
			console.log("[authentication > 'GET' validate] response:", response);

		useAuthStore.setState({
			authenticated: true,
			clientUuid: response.userId,
		});
	} catch(error) {
		useSceneStore.getState().setCurrentScene("Login");

		useNotificationStore.getState().showNotification(
			error instanceof Error
			? error.message
			: String(error), NOTIFICATION_TYPE.error
		);

		console.warn("[authentication > 'GET' validate] error:", error);
	}
};