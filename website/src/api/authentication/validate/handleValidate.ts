import { fetchValidate } from "./fetchValidate";
import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";

export const handleValidate = async () => {
	try {
		const response = await fetchValidate();
		useProfileStore.setState({ validateResponse: response });
	} catch(err) {
		useSceneStore.getState().setCurrentScene("Login");
		useNotificationStore.getState().showNotification(err instanceof Error ? err.message : String(err), NOTIFICATION_TYPE.error);
		console.log("[handleValidate] err:", err);
	}
};