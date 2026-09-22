import { fetchSignIn } from "./fetchSignIn";
import { useAuthStore } from "../../../store/AuthStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";
import { handleGetProfile } from "../../profile/get_profile/handleGetProfile";
import { handleGetSettings } from "../../profile/get_settings/handleGetSettings";
import { useSettingsStore } from "../../../store/SettingsStore";

export const handleSignIn = async (email: string, password: string) => {
	const { setShowWindow, setCurrentScene } = useSceneStore.getState();
	const { showNotification } = useNotificationStore.getState();

	try {
		const response = await fetchSignIn(email, password);
		useAuthStore.setState({ clientUuid: response.id });
		useProfileStore.setState({ validateResponse: response });

		await handleGetProfile(response.id);
		await useProfileStore.getState().setCachedData();
		const settings = await handleGetSettings(response.id);
		console.log("settings:", settings);
		useSettingsStore.setState({
			
		});

		setShowWindow("signIn", false);
		setCurrentScene("Home");

		showNotification("Signed in successfully", NOTIFICATION_TYPE.message);
		console.log("[handleSignIn] response.id: ", response.id);
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handleSignIn] errorMsg:", errorMsg);
		showNotification(errorMsg, NOTIFICATION_TYPE.error);
	}
}
