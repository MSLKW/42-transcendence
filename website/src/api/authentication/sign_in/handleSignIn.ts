import type { Dispatch, SetStateAction } from "react";
import { signInFetch } from "./fetchSignIn";
import { partySocket } from "../../party/partySocket";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";

export const handleSignIn = async (email: string, password: string, setIsLoading: Dispatch<SetStateAction<boolean>>) => {
	const setClientUuid = useProfileStore.getState().setClientUuid;
	const { setShowWindow, setCurrentScene } = useSceneStore.getState();
	const { showNotification } = useNotificationStore.getState();

	try {
		setIsLoading(true);
		const response = await signInFetch(email, password);

		setClientUuid(response.id);
		setShowWindow("signIn", false);
		setCurrentScene("Home");
		partySocket.connect();
		console.log("[handleSignIn] Successfully signed in! response.id: ", response.id);
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handleSignIn] ", errorMsg);
		showNotification(errorMsg, NOTIFICATION_TYPE.error);
	} finally {
		setIsLoading(false);
	}
}
