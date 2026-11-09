import type { Dispatch, SetStateAction } from "react";
import { fetchSignUp } from "./fetchSignUp";
import { fetchSignIn } from "../post_signin/fetchSignIn";
import { handleFriendships } from "../../friends/get_friendships/handleFriendships";
import { handleOwnPlayerGameData } from "../../gameStats/get_own-player-game-data/handleOwnPlayerGameData";
import { useAuthStore } from "../../../store/AuthStore";
import { useFriendsStore } from "../../../store/FriendsStore";
import { useGameStatsStore } from "../../../store/GameStatsStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { useSceneStore } from "../../../store/SceneStore";

export const handleSignUp = async (email: string, password: string, setIsLoading: Dispatch<SetStateAction<boolean>>) => {
	if (!useAuthStore.getState().authAPIConnection)
		return;

	try {
		setIsLoading(true);
		await fetchSignUp(email, password);

		if (useAuthStore.getState().authVerboseMode)
			console.log("[authentication > 'POST' signup]");

		/** Sign in immediately after registration so the rest of the app can use the new session */
		const response = await fetchSignIn(email, password);

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

		useSceneStore.getState().setShowWindow("createAccount", false);
		useSceneStore.getState().setCurrentScene("Home");
		useNotificationStore.getState().showNotification("Account created successfully", NOTIFICATION_TYPE.message);
		useNotificationStore.setState({ isNotifFiltered: false });
	} catch (err) {
		useAuthStore.setState({
			isAuthenticated: false,
			clientUuid: null,
		});

		const error = err instanceof Error ? err.message : "Something went wrong. Please try again";
		useNotificationStore.getState().showNotification(error, NOTIFICATION_TYPE.error);
		if (useAuthStore.getState().authVerboseMode)
			console.warn("[authentication > 'POST' signup] error:", error);
	} finally {
		setIsLoading(false);
	}
}