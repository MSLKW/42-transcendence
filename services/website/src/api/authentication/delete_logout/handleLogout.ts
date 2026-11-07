import { useAuthStore } from "../../../store/AuthStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore"; 
import { useSceneStore } from "../../../store/SceneStore";
import { fetchLogout } from "./fetchLogout";

export const handleLogout = async () => {
	if (!useAuthStore.getState().authAPIEnabled)
		return;

	try {
		await fetchLogout();

		if (useAuthStore.getState().authVerboseMode)
			console.log("[authentication > 'DELETE' logout]");

		useSceneStore.getState().setCurrentScene("Login");

		useNotificationStore.getState().showNotification("Logged out successfully", NOTIFICATION_TYPE.message);
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		useNotificationStore.getState().showNotification(error, NOTIFICATION_TYPE.error);

		if (useAuthStore.getState().authVerboseMode)
			console.warn("[authentication > 'DELETE' logout] error:", error);
	}
};