import { fetchValidate } from "./fetchValidate";
import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";
import { useAuthStore } from "../../../store/AuthStore";

export const handleValidate = async () => {
	try {
		const response = await fetchValidate();
		useProfileStore.setState({ validateResponse: response });

		const resp_json = await response?.json();

		useAuthStore.setState({ clientUuid: resp_json.userId })
	} catch(err) {
		useSceneStore.getState().setCurrentScene("Login");
		useNotificationStore.getState().showNotification(err instanceof Error ? err.message : String(err), NOTIFICATION_TYPE.error);
		console.log("[handleValidate] err:", err);
	}
};