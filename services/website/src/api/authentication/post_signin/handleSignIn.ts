import { fetchSignIn } from "./fetchSignIn";
import { handleFriendships } from "../../friends/get_friendships/handleFriendships";
import { handleOwnPlayerGameData } from "../../gameStats/get_own-player-game-data/handleOwnPlayerGameData";
import { useAuthStore } from "../../../store/AuthStore";
import { useFriendsStore } from "../../../store/FriendsStore";
import { useGameStatsStore } from "../../../store/GameStatsStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { useSceneStore } from "../../../store/SceneStore";

export const handleSignIn = async (email: string, password: string) => {
	try {
		const response = await fetchSignIn(email, password);

		if (useAuthStore.getState().authVerboseMode)
			console.log("[authentication > 'POST' signin] response:", response);

		const [clientStats, clientFriends] = await Promise.all([
			handleOwnPlayerGameData(),
			handleFriendships(response.id),
		]);

		useAuthStore.setState({
			isAuthenticated: true,
			clientUuid: response.id,
		});
		useFriendsStore.setState({ cachedFriends: clientFriends });
		useGameStatsStore.setState({ cachedBadges: clientStats.badges });
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