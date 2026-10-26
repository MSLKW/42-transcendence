import { fetchSignIn } from "./fetchSignIn";
import { useAuthStore } from "../../../store/AuthStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { useSceneStore } from "../../../store/SceneStore";

export const handleSignIn = async (email: string, password: string) => {
	try {
		const response = await fetchSignIn(email, password);

		if (useAuthStore.getState().authVerboseMode)
			console.log("[authentication > 'POST' signin] response:", response);

		useAuthStore.setState({
			isAuthenticated: true,
			clientUuid: response.id,
		});
		useSceneStore.getState().setShowWindow("signIn", false);
		useSceneStore.getState().setCurrentScene("Home");

		useNotificationStore.getState().showNotification("Signed in successfully", NOTIFICATION_TYPE.message);
		useNotificationStore.setState({ isNotifFiltered: false });
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		useNotificationStore.getState().showNotification(error, NOTIFICATION_TYPE.error);

		useAuthStore.setState({
			isAuthenticated: false,
			clientUuid: null,
		});

		console.warn("[handleSignIn] 'POST' error:", error);
	}
}