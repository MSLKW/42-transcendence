import { signInFetch } from "./fetchSignIn";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";
import { handleGetProfile } from "../../profile/get_profile/handleGetProfile";

export const handleSignIn = async (email: string, password: string) => {
	const { setShowWindow, setCurrentScene } = useSceneStore.getState();
	const { showNotification } = useNotificationStore.getState();

	try {
		const response = await signInFetch(email, password);
		useProfileStore.setState({
			validateResponse: response,
			clientUuid: response.id,
		});

		await handleGetProfile(response.id);
		await useProfileStore.getState().setCachedData();

		setShowWindow("signIn", false);
		setCurrentScene("Home");

		console.log("[handleSignIn] response.id: ", response.id);
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handleSignIn] errorMsg:", errorMsg);
		showNotification(errorMsg, NOTIFICATION_TYPE.error);
	}
}
