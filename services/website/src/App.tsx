import { useRef, useEffect, useCallback } from "react";
import { handleValidate } from "./api/authentication/get_validate/handleValidate";
import { chatSocket } from "./api/chat/chatSocket";
import { partySocket } from "./api/party/partySocket";
import { subscribeToMessages } from "./api/chat/subscribe/subscribeToMessages";
import { subscribeToUserJoined } from "./api/chat/subscribe/subscribeToUserJoined";
import { subscribeToUserLeft } from "./api/chat/subscribe/subscribeToUserLeft";
import { subscribeToUserTyping } from "./api/chat/subscribe/subscribeToUserTyping";
import { subscribeToRateLimited } from "./api/chat/subscribe/subscribeToRateLimited";
import { handleFriendships } from "./api/friends/get_friendships/handleFriendships";
import { handleFriendRequestsSent } from "./api/friends/get_friend-requests_sent/handleFriendRequestsSent";
import { handleFriendRequestsReceived } from "./api/friends/get_friend-requests_received/handleFriendRequestsReceived";
import { handleFriendRequestsAccept } from "./api/friends/post_friend-requests_accept/handleFriendRequestsAccept";
import { handleFriendRequestsReject } from "./api/friends/post_friend-requests_reject/handleFriendRequestsReject";
import { handleGetProfile } from "./api/profile/get_profile/handleGetProfile";
import { useAuthStore } from "./store/AuthStore";
import { useChatStore } from "./store/ChatStore";
import { useFriendsStore } from "./store/FriendsStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "./store/NotificationStore";
import { usePartyStore } from "./store/PartyStore";
import { useProfileStore } from "./store/ProfileStore";
import { useSceneStore } from "./store/SceneStore";
import { useScrollToTop } from "./utilities/react/useScrollToTop";
import { StripeBg } from "./components/bg/Stripe";
import { LoginScene } from "./components/login/LoginScene";
import { HomeScene } from "./components/home/HomeScene";
import { LobbyScene } from "./components/lobby/LobbyScene";
import { GameScene } from "./components/game/GameScene";
import { ChatWindow } from "./components/chat/ChatWindow";
import { CreateAccountWindow } from "./components/login/create_account/CreateAccountWindow";
import { InfoWindow } from "./components/info/InfoWindow";
import { LeaveWindow } from "./components/leave/LeaveWindow";
import { NotificationWindow } from "./components/notification/NotificationWindow";
import { PartyWindow } from "./components/party/PartyWindow";
import { ProfileWindow } from "./components/profile/ProfileWindow";
import { RankWindow } from "./components/game/rank/RankWindow";
import { ResultsWindow } from "./components/results/ResultsWindow";
import { SignInWindow } from "./components/login/sign_in/SignInWindow";
import { SetupWindow } from "./components/setup/SetupWindow";
import { StaleWindow } from "./components/stale/StaleWindow";
import { StatsWindow } from "./components/stats/StatsWindow";
import { ThreeJsManager } from './components/3d/ThreeJsManager';
import { gameInstance, joinGameLobby, clearGameInstance } from "./api/game/main";
import Dev from "./Dev";
import { useFriendEvents } from "./api/friends/useFriendEvents";
import { useGameStore } from "./store/GameStore";

export let threejsManager: ThreeJsManager;

export default function App() {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const chatAPIConnection = useChatStore((store) => store.chatAPIConnection);
	const friendsVerboseMode = useFriendsStore((store) => store.friendsVerboseMode);
	const gameAPIConnection = useGameStore((store) => store.gameAPIConnection);
	const partyAPIConnection = usePartyStore((store) => store.partyAPIConnection);
	const partyGameId = usePartyStore((store) => store.partyGameId);
	const cachedProfiles = useProfileStore((store) => store.cachedProfiles);
	const currentScene = useSceneStore((store) => store.currentScene);
	const showWindow = useSceneStore((store) => store.showWindow);

	const showDevSection = import.meta.env.SHOW_DEV_SECTION;

	/** Party socket connection */
	useEffect(() => {
		if (!clientUuid || currentScene === "Login")
			return;

		if (partyAPIConnection)
			partySocket.connect();
		else
			partySocket.disconnect();

		return () => {
			partySocket.disconnect();
		};
	}, [clientUuid, partyAPIConnection]);

	/** Chat socket connection + subscriptions */
	useEffect(() => {
		if (!clientUuid)
			return;

		if (!chatAPIConnection) {
			chatSocket.disconnect();
			return;
		}

		chatSocket.connect();
		const unsubscribeFromMessages = subscribeToMessages();
		const unsubscribeFromUserJoined = subscribeToUserJoined();
		const unsubscribeFromUserLeft = subscribeToUserLeft();
		const unsubscribeFromUserTyping = subscribeToUserTyping();
		const unsubscribeFromRateLimited = subscribeToRateLimited();

		return () => {
			unsubscribeFromMessages();
			unsubscribeFromUserJoined();
			unsubscribeFromUserLeft();
			unsubscribeFromUserTyping();
			unsubscribeFromRateLimited();
			chatSocket.disconnect();
		};
	}, [clientUuid, chatAPIConnection]);

	/** Friends connection */
	const handleFriendUpdate = useCallback(() => {
		if (!clientUuid)
			return;

		void handleFriendships(clientUuid)
			.then((friends) => {
				useFriendsStore.setState({ cachedFriends: friends });
			})
			.catch((error) => {
				if (friendsVerboseMode)
					console.warn("Failed to refresh friendships:", error);
			})
	}, [clientUuid]);
	useFriendEvents(clientUuid, handleFriendUpdate);

	/** Friend requests sent + received */
	useEffect(() => {
		if (!clientUuid || currentScene === "Login")
			return;

		void handleFriendRequestsSent(clientUuid)
			.then((requests) => {
				useFriendsStore.setState({ friendRequestSent: requests });
			});

		void handleFriendRequestsReceived(clientUuid)
			.then(async (requests) => {
				await Promise.all(
					requests.map(async (req: any) => {
						const profile = await handleGetProfile(req.senderId);

						useNotificationStore.getState().showNotification(
							`${profile?.username} wants to be friends with you`,
							NOTIFICATION_TYPE.invite,
							req.id,
							() => handleFriendRequestsAccept(req.id, profile?.username ?? "Player"),
							() => handleFriendRequestsReject(req.id, profile?.username ?? "Player")
						);
					})
				);
			});
	}, [clientUuid, currentScene]);

	/** Three js manager */
	const containerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!containerRef.current)
			return ;
		threejsManager = new ThreeJsManager(containerRef.current);

		return () => {
			if (threejsManager) {
				threejsManager.dispose()
			}
		}
	}, []);

	/** Three js scene handler */
	useEffect(() => {
		if (!threejsManager)
			return;

		const currentSceneLowered = currentScene.toLowerCase();
		if (threejsManager.getSceneId() !== currentSceneLowered) {
			threejsManager.changeScene(currentSceneLowered);
		}
	}, [currentScene]);

	/** Scroll to top */
	useEffect(() => {
		useScrollToTop();
	}, [currentScene]);

	/** Initial profile setup */
	useEffect(() => {
		if (currentScene === "Login" || !clientUuid)
			return;

		if (!cachedProfiles[clientUuid]?.name || !cachedProfiles[clientUuid]?.avatar)
			useSceneStore.getState().setShowWindow("setup", true);
		else
			useSceneStore.getState().setShowWindow("setup", false);
	}, [currentScene, clientUuid, cachedProfiles]);

	// Connect to game server
	useEffect(() => {
		if (!gameAPIConnection)
			return;

		if (partyGameId === null && gameInstance !== null) {
			clearGameInstance();
		}
		else if (partyGameId !== null && clientUuid)
			joinGameLobby(partyGameId, clientUuid);
		// else if (usePartyStore.getState().partyVerboseMode)
			// console.log("[party > 'on' party_state] Blocked from joining game lobby w/ partyGameId:", partyGameId);
	}, [partyGameId]);

	/** Kicks client back to login is invalidated */
	const hasValidated = useRef(false);
	useEffect(() => {
		if (hasValidated.current || currentScene === "Login")
			return;
		hasValidated.current = true;

		void handleValidate().then((res) => {
			if (!res)
				useSceneStore.getState().setCurrentScene("Login");
		});
	}, []);

	return (
		<>
			<StripeBg />
			<section className="
				z-0 absolute top-0 left-1/2 -translate-x-1/2
				h-full min-h-120 max-h-360
				w-full min-w-80 max-w-360
			">
				{ <div className="w-full h-full" ref={containerRef}/> }
			</section>
			<section className="
				h-full min-h-120 max-h-360
				w-full min-w-80 max-w-360
				mx-auto p-[clamp(0.125rem,5vw+0.125rem,3.125rem)]
				flex flex-col
				z-1 relative
				pointer-events-none
			">
				{ currentScene === "Login" && <LoginScene /> }
				{ currentScene === "Home" && <HomeScene /> }
				{ currentScene === "Lobby" && <LobbyScene /> }
				{ currentScene === "Game" && <GameScene /> }
				{ showWindow["chat"] && <ChatWindow /> }
				{ showWindow["createAccount"] && <CreateAccountWindow /> }
				{ showWindow["info"] && <InfoWindow /> }
				{ showWindow["notification"] && <NotificationWindow /> }
				{ showWindow["leave"] && <LeaveWindow /> }
				{ showWindow["party"] && <PartyWindow /> }
				{ showWindow["profile"] && <ProfileWindow /> }
				{ showWindow["rank"] && <RankWindow /> }
				{ showWindow["results"] && <ResultsWindow /> }
				{ showWindow["setup"] && <SetupWindow /> }
				{ showWindow["signIn"] && <SignInWindow /> }
				{ showWindow["stale"] && <StaleWindow /> }
				{ showWindow["stats"] && <StatsWindow /> }
			</section>
			{ showDevSection && <Dev /> }
		</>
	);
}
