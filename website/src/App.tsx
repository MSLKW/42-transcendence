import { useRef, useEffect } from "react";
// import { Canvas } from "@react-three/fiber";
// import { Stats, PerspectiveCamera, OrbitControls, AdaptiveDpr } from "@react-three/drei";
import { Stats } from "@react-three/drei";

import { chatSocket } from "./api/chat/chatSocket";
import { partySocket } from "./api/party/partySocket";
import { useAuthStore } from "./store/AuthStore";
import { useChatStore } from "./store/ChatStore";
import { useDevStore } from "./store/DevStore";
import { usePartyStore } from "./store/PartyStore";
import { useProfileStore } from "./store/ProfileStore";
import { useSceneStore } from "./store/SceneStore";

import { subscribeToMessages } from "./api/chat/subscribe/subscribeToMessages";
import { subscribeToUserJoined } from "./api/chat/subscribe/subscribeToUserJoined";
import { subscribeToUserLeft } from "./api/chat/subscribe/subscribeToUserLeft";
import { subscribeToUserTyping } from "./api/chat/subscribe/subscribeToUserTyping";
import { subscribeToRateLimited } from "./api/chat/subscribe/subscribeToRateLimited";

import { useScrollToTop } from "./utilities/useScrollToTop";

import { StripeBg } from "./components/bg/Stripe";
import { LoginScene } from "./components/login/LoginScene";
import { HomeScene } from "./components/home/HomeScene";
import { LobbyScene } from "./components/lobby/LobbyScene";
import { TestScene } from "./components/test/TestScene";
import { GameScene } from "./components/game/GameScene";
import { BotsWindow } from "./components/bots/BotsWindow";
import { ChatWindow } from "./components/chat/ChatWindow";
import { CreateAccountWindow } from "./components/login/create_account/CreateAccountWindow";
import { InfoWindow } from "./components/info/InfoWindow";
import { LeaveWindow } from "./components/leave/Leave";
import { NotificationWindow } from "./components/notification/NotificationWindow";
import { PartyWindow } from "./components/party/PartyWindow";
import { ProfileWindow } from "./components/profile/ProfileWindow";
import { RankWindow } from "./components/game/rank/RankWindow";
import { ResultsWindow } from "./components/results/ResultsWindow";
import { SignInWindow } from "./components/login/sign_in/SignInWindow";
import { SettingsWindow } from "./components/settings/SettingsWindow";
import { SetupWindow } from "./components/setup/SetupWindow";
import { StatsWindow } from "./components/stats/StatsWindow";
import { ThreeJsManager } from './components/3d/ThreeJsManager';
import Dev from "./Dev";
import { handleValidate } from "./api/authentication/validate/handleValidate";

export let threejsManager: ThreeJsManager;

export default function App() {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const chatReconnect = useChatStore((store) => store.chatReconnect);
	const showStats = useDevStore((store) => store.showStats);
	const hostUuid = usePartyStore((store) => store.hostUuid);
	const cachedData = useProfileStore((store) => store.cachedData);
	const currentScene = useSceneStore((store) => store.currentScene);
	const showWindow = useSceneStore((store) => store.showWindow);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);
	const showDevSection = useDevStore((store) => store.showDevSection);

	//scroll to top
	useEffect(() => {
		useScrollToTop();
	}, [currentScene]);

	//validate on first website load
	useEffect(() => {
		if (currentScene !== "Login")
			handleValidate();
	}, []);


	//inital profile setup
	useEffect(() => {
		if (currentScene === "Login" || !clientUuid)
			return;

		if (!cachedData[clientUuid] || !cachedData[clientUuid]?.name || !cachedData[clientUuid]?.avatar)
			setShowWindow("setup", true);
	}, [currentScene]);

	//party socket connection
	useEffect(() => {
		if (currentScene === "Login" || !clientUuid)
			return;

		partySocket.connect();
	}, [currentScene, clientUuid]);

	//chat socket connection + subscriptions
	useEffect(() => {
		if (currentScene === "Login" || !clientUuid)
			return;

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
		};
	}, [currentScene, clientUuid, chatReconnect]);

	//three js
	const containerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!containerRef.current) {
			return ;
		}
		threejsManager = new ThreeJsManager(containerRef.current);

		return () => {
			if (threejsManager) {
				threejsManager.dispose()
			}
		}
	}, []);

	useEffect(() => {
		const currentSceneLowered = currentScene.toLowerCase();
		if (threejsManager.getSceneId() !== currentSceneLowered) {
			threejsManager.changeScene(currentSceneLowered);
		}
	}, [currentScene]);

	//chat room changes
	useEffect(() => {
		if (currentScene !== "Login" || !clientUuid || !hostUuid)
			return;

		if (hostUuid)
			chatSocket.joinRoom(hostUuid);
		else if (clientUuid)
			chatSocket.joinRoom(clientUuid);
	}, [hostUuid, clientUuid]);

	return (
		<>
			{ (currentScene === "Login" || currentScene === "Home") && <StripeBg /> }
			{ showStats && <Stats /> }
			<section
				className="
					z-0 absolute top-0 left-1/2 -translate-x-1/2
					h-full min-h-120 max-h-360
					w-full min-w-80 max-w-360
				"
			>
				{ <div className="w-full h-full" ref={containerRef}/> }
			</section>
			<section
				className="
					h-full min-h-120 max-h-360
					w-full min-w-80 max-w-360
					mx-auto p-[clamp(0.125rem,5vw+0.125rem,3.125rem)]
					flex flex-col
					z-1 relative
					pointer-events-none
				"
			>
				{ currentScene === "Login" && <LoginScene /> }
				{ currentScene === "Home" && <HomeScene /> }
				{ currentScene === "Lobby" && <LobbyScene /> }
				{ currentScene === "Test" && <TestScene /> }
				{ currentScene === "Game" && <GameScene /> }
				{ showWindow["bots"] && <BotsWindow /> }
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
				{ showWindow["settings"] && <SettingsWindow /> }
				{ showWindow["signIn"] && <SignInWindow /> }
				{ showWindow["stats"] && <StatsWindow /> }
			</section>
			{ showDevSection && <Dev /> }
		</>
	);
}