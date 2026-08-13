import type { Dispatch, SetStateAction } from "react";
import { signUpFetch } from "./fetchSignUp";
import { signInFetch } from "../sign_in/fetchSignIn";
import { partySocket } from "../../party/partySocket";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";

export const handleSignUp = async (email: string, password: string, setIsLoading: Dispatch<SetStateAction<boolean>>) => {
	const { showNotification } = useNotificationStore.getState();
	const setClientUuid = useProfileStore.getState().setClientUuid;
	const { setShowWindow, setCurrentScene } = useSceneStore.getState();

	try {
		setIsLoading(true);
		await signUpFetch(email, password);

		const response = await signInFetch(email, password);
		setClientUuid(response.id);
		console.log("[handleSignUp] Success, response.id:", response.id);

		setShowWindow("createAccount", false);
		setCurrentScene("HOME");
		partySocket.connect();
		showNotification("Account created successfully!", NOTIFICATION_TYPE.message);
		console.log("[handleSignUp] Account created successfully!");
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		showNotification(errorMsg, NOTIFICATION_TYPE.error);
	} finally {
		setIsLoading(false);
	}
}