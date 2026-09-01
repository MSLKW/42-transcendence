import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";

export const fetchValidate = async () => {
	const response = await fetch("/api/auth/validate", {
		method: "GET",
		credentials: "include",
	});
	
	if (!response.ok && useProfileStore.getState().isAuthenticated) {
		useProfileStore.setState({ isAuthenticated: false });
		useSceneStore.getState().setCurrentScene("Login");
		useNotificationStore.getState().showNotification("Invalid or expired session", NOTIFICATION_TYPE.error);
		console.log("[/api/auth/validate] error: Invalid or expired session");
		return;
	}
	
	useProfileStore.setState({ isAuthenticated: true });
	console.log("[/api/auth/validate] 200 OK");
	return response;
}