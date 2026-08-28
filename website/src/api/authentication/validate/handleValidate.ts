import { fetchValidate } from "./fetchValidate";
import { NOTIFICATION_TYPE, useNotificationStore } from "../../../store/NotificationStore";
import { useSceneStore } from "../../../store/SceneStore";

export const handleValidate = async () => {
	try {
		await fetchValidate();
	} catch(err) {
		useSceneStore.getState().setCurrentScene("Login");
		useNotificationStore.getState().showNotification(err instanceof Error ? err.message : String(err), NOTIFICATION_TYPE.error);
		console.log("[handleValidate] err:", err);
	}
};