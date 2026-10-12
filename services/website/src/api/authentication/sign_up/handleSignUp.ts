import type { Dispatch, SetStateAction } from "react";
import { fetchSignUp } from "./fetchSignUp";
import { fetchSignIn } from "../sign_in/fetchSignIn";
import { useAuthStore } from "../../../store/AuthStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { useSceneStore } from "../../../store/SceneStore";

export const handleSignUp = async (email: string, password: string, setIsLoading: Dispatch<SetStateAction<boolean>>) => {
	const { showNotification } = useNotificationStore.getState();
	const { setShowWindow, setCurrentScene } = useSceneStore.getState();

	try {
		setIsLoading(true);
		await fetchSignUp(email, password);
		const response = await fetchSignIn(email, password);

		useAuthStore.setState({ clientUuid: response.id });

		setShowWindow("createAccount", false);
		setCurrentScene("Home");

		showNotification("Account created successfully", NOTIFICATION_TYPE.message);
		console.log("[handleSignUp] Account created successfully!");
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		showNotification(errorMsg, NOTIFICATION_TYPE.error);
	} finally {
		setIsLoading(false);
	}
}