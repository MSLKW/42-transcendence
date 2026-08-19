import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, PerspectiveCamera, OrbitControls, AdaptiveDpr } from "@react-three/drei";
import { handleValidate } from "./api/authentication/validate/handleValidate";
import { partySocket } from "./api/party/partySocket";
import { useDevStore } from "./store/DevStore";
import { useProfileStore } from "./store/ProfileStore";
import { useSceneStore } from "./store/SceneStore";
import { useScrollToTop } from "./utilities/useScrollToTop";
import { StripeBg } from "./components/bg/Stripe";
import { SphereBg } from "./components/3d/Sphere";
import { Card } from "./components/3d/PCard";
import { LoginScene } from "./components/login/LoginScene";
import { HomeScene } from "./components/home/HomeScene";
import { LobbyScene } from "./components/lobby/LobbyScene";
import { TestScene } from "./components/test/TestScene";
import { GameScene } from "./components/game/GameScene";
import { ResultsScene } from "./components/results/ResultsScene";
import { BotsWindow } from "./components/bots/BotsWindow";
import { ChatWindow } from "./components/chat/ChatWindow";
import { CreateAccountWindow } from "./components/login/create_account/CreateAccountWindow";
import { InfoWindow } from "./components/info/InfoWindow";
import { NotificationWindow } from "./components/notification/NotificationWindow";
import { PartyWindow } from "./components/party/PartyWindow";
import { ProfileWindow } from "./components/profile/ProfileWindow";
import { RankWindow } from "./components/game/rank/RankWindow";
import { ResultsWindow } from "./components/results/ResultsWindow";
import { SignInWindow } from "./components/login/sign_in/SignInWindow";
import { SettingsWindow } from "./components/settings/SettingsWindow";
import { SetupWindow } from "./components/setup/SetupWindow";
import { StatsWindow } from "./components/stats/StatsWindow";
import Dev from "./Dev";

export default function App() {
	const { clientUuid, getProfileData } = useProfileStore();
	const { currentScene, showWindow, setShowWindow } = useSceneStore();
	const { showDevSection, showStats } = useDevStore();
	
	useEffect(() => {
		useScrollToTop();
		handleValidate();
		
		if (currentScene !== "Login") {
			const data = getProfileData(clientUuid!);
			if (!data?.name)
				setShowWindow("setup", true);

			if (!partySocket.isSocketActive())
				partySocket.connect();
		}
	}, [currentScene]);

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
				{ currentScene === "Login" && 
					<Canvas>
						<AdaptiveDpr />
						<ambientLight intensity={0.5} />
						<directionalLight position={[0, 5, 5]} intensity={0.5} />
						{ currentScene === "Login" &&
							<Card
								position={[0,0.25,0]}
								rotation={[-Math.PI/4,0,0]}
								color="gold"
							/>
						}
						<SphereBg />
						<PerspectiveCamera makeDefault position={[0, 0, 2.25]} />
						<OrbitControls enableZoom={false} />
					</Canvas>
				}
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
				{ currentScene === "Results" && <ResultsScene /> }
				{ showWindow["bots"] && <BotsWindow /> }
				{ showWindow["chat"] && <ChatWindow /> }
				{ showWindow["createAccount"] && <CreateAccountWindow /> }
				{ showWindow["info"] && <InfoWindow /> }
				{ showWindow["notification"] && <NotificationWindow /> }
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