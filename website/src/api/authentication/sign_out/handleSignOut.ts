import { useGameStore } from "../../../store/GameStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore"; 
import { useSceneStore } from "../../../store/SceneStore";
import { signOutFetch } from "./fetchSignOut";
import { partySocket } from "../../party/partySocket";
import { useProfileStore } from "../../../store/ProfileStore";

export const handleSignOut = async () => {
	try {
		await signOutFetch();

		useGameStore.getState().endGame();
		usePartyStore.setState({ members: [] });
		usePartyStore.setState({ partyGameId: null });
		useProfileStore.setState({ clientUuid: "n/a" });
		partySocket.disconnect();

		useSceneStore.getState().setCurrentScene("Login");
		useNotificationStore.getState().showNotification("Logged out successfully", NOTIFICATION_TYPE.message);
		console.log("[handleSignOut] Logged out successfully!");
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handleSignOut] ", errorMsg)
		useNotificationStore.getState().showNotification(errorMsg, NOTIFICATION_TYPE.error);
	}
};