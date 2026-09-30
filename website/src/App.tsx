import { useRef, useEffect } from "react";
import { chatSocket } from "./api/chat/chatSocket";
import { partySocket } from "./api/party/partySocket";
import { useAuthStore } from "./store/AuthStore";
import { useDevStore } from "./store/DevStore";
import { useProfileStore } from "./store/ProfileStore";
import { useSceneStore } from "./store/SceneStore";
import { handleValidate } from "./api/authentication/validate/handleValidate";
import { subscribeToMessages } from "./api/chat/subscribe/subscribeToMessages";
import { subscribeToUserJoined } from "./api/chat/subscribe/subscribeToUserJoined";
import { subscribeToUserLeft } from "./api/chat/subscribe/subscribeToUserLeft";
import { subscribeToUserTyping } from "./api/chat/subscribe/subscribeToUserTyping";
import { subscribeToRateLimited } from "./api/chat/subscribe/subscribeToRateLimited";
import { useScrollToTop } from "./utilities/react/useScrollToTop";
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
import { LeaveWindow } from "./components/leave/LeaveWindow";
import { NotificationWindow } from "./components/notification/NotificationWindow";
import { PartyWindow } from "./components/party/PartyWindow";
import { ProfileWindow } from "./components/profile/ProfileWindow";
import { RankWindow } from "./components/game/rank/RankWindow";
import { ResultsWindow } from "./components/results/ResultsWindow";
import { SignInWindow } from "./components/login/sign_in/SignInWindow";
import { SettingsWindow } from "./components/settings/SettingsWindow";
import { SetupWindow } from "./components/setup/SetupWindow";
// import { StaleWindow } from "./components/stale/StaleWindow";
import { StatsWindow } from "./components/stats/StatsWindow";
import { ThreeJsManager } from './components/3d/ThreeJsManager';
import Dev from "./Dev";

export let threejsManager: ThreeJsManager;

export default function App() {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const cachedData = useProfileStore((store) => store.cachedData);
	const isProfileLoaded = useProfileStore((store) => store.isProfileLoaded);
	const currentScene = useSceneStore((store) => store.currentScene);
	const showWindow = useSceneStore((store) => store.showWindow);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);
	const showDevSection = useDevStore((store) => store.showDevSection);

	//validate
	useEffect(() => {
		if (currentScene === "Login" || clientUuid)
			return;

		handleValidate();
	}, [currentScene, clientUuid]);

	//party socket connection
	useEffect(() => {
		if (!clientUuid)
			return;

		partySocket.connect();

		return () => {
			partySocket.disconnect();
		};
	}, [clientUuid]);

	//chat socket connection + subscriptions
	useEffect(() => {
		if (!clientUuid)
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
			chatSocket.disconnect();
		};
	}, [clientUuid]);

	//three js manager
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

	//three js scene handler
	useEffect(() => {
		const currentSceneLowered = currentScene.toLowerCase();
		if (threejsManager.getSceneId() !== currentSceneLowered) {
			threejsManager.changeScene(currentSceneLowered);
		}
	}, [currentScene]);

	//scroll to top
	useEffect(() => {
		useScrollToTop();
	}, [currentScene]);

	//inital profile setup
	useEffect(() => {
		if (currentScene === "Login" || !clientUuid || !isProfileLoaded)
			return;

		if (!cachedData[clientUuid]?.name || !cachedData[clientUuid]?.avatar)
			setShowWindow("setup", true);
		else
			setShowWindow("setup", false);
	}, [currentScene, clientUuid, cachedData, isProfileLoaded]);

	//close window on scene change
	useEffect(() => {
		useSceneStore.getState().resetWindows();
	}, [currentScene]);

	return (
		<>
			{ (currentScene === "Login" || currentScene === "Home") && <StripeBg /> }
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
				{/* { showWindow["stale"] && <StaleWindow /> } */}
				{ showWindow["stats"] && <StatsWindow /> }
			</section>
			{ showDevSection && <Dev /> }
		</>
	);
}