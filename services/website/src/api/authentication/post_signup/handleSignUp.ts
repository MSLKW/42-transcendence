import type { Dispatch, SetStateAction } from "react";
import { fetchSignUp } from "./fetchSignUp";
import { fetchSignIn } from "../post_signin/fetchSignIn";
import { useAuthStore } from "../../../store/AuthStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { useSceneStore } from "../../../store/SceneStore";

export const handleSignUp = async (email: string, password: string, setIsLoading: Dispatch<SetStateAction<boolean>>) => {
	try {
		setIsLoading(true);
		await fetchSignUp(email, password);

		if (useAuthStore.getState().authVerboseMode)
			console.log("[authentication > 'POST' signup]");

		const response = await fetchSignIn(email, password);
		useAuthStore.setState({
			isAuthenticated: true,
			clientUuid: response.id,
		});
		useSceneStore.getState().setShowWindow("createAccount", false);
		useSceneStore.getState().setCurrentScene("Home");

		useNotificationStore.getState().showNotification("Account created successfully", NOTIFICATION_TYPE.message);
		useNotificationStore.setState({ isNotifFiltered: false });
	} catch (err) {
		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";

		useNotificationStore.getState().showNotification(error, NOTIFICATION_TYPE.error);
		useAuthStore.setState({
			isAuthenticated: false,
			clientUuid: null,
		});
		console.warn("[authentication > 'POST' signup] error:", error);
	} finally {
		setIsLoading(false);
	}
}