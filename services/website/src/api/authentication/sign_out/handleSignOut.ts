import { useAuthStore } from "../../../store/AuthStore";
import { useBubbleStore } from "../../../store/BubbleStore";
import { useChatStore } from "../../../store/ChatStore";
import { useGameStore } from "../../../store/GameStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore"; 
import { usePartyStore } from "../../../store/PartyStore";
import { useSceneStore, defaultShowWindow } from "../../../store/SceneStore";
import { fetchSignOut } from "./fetchSignOut";
import { partySocket } from "../../party/partySocket";
import { chatSocket } from "../../chat/chatSocket";
import { useProfileStore } from "../../../store/ProfileStore";

export const handleSignOut = async () => {
	try {
		await fetchSignOut();

		useGameStore.getState().resetGame();

		useAuthStore.setState({ clientUuid: null });

		usePartyStore.setState({
			members: [],
			partyGameId: null,
		});
		partySocket.disconnect();

		useProfileStore.getState().clearCachedData();

		useChatStore.setState({ cachedChat: [] });
		chatSocket.disconnect();

		useBubbleStore.getState().clearAllBubbles();

		useSceneStore.setState({
			showWindow: defaultShowWindow,
			currentScene: "Login",
		});

		useNotificationStore.getState().showNotification("Logged out successfully", NOTIFICATION_TYPE.message);
		console.log("[handleSignOut] Logged out successfully!");
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
		console.log("[handleSignOut] ", errorMsg)
		useNotificationStore.getState().showNotification(errorMsg, NOTIFICATION_TYPE.error);
	}
};