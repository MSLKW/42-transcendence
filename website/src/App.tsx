import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, PerspectiveCamera, OrbitControls, AdaptiveDpr } from "@react-three/drei";
import { fetchValidate } from "./api/authentication/validate/fetchValidate";
import { partySocket } from "./api/party/partySocket";
import { useDevStore } from "./store/DevStore";
import { useNotificationStore } from "./store/NotificationStore";
import { useProfileStore } from "./store/ProfileStore";
import { useSceneStore } from "./store/SceneStore";
import { StripeBg } from "./components/bg/Stripe";
import { SphereBg } from "./components/3d/Sphere";
import { Card } from "./components/3d/PCard";
import { LoginScene } from "./components/login/LoginScene";
import { HomeScene } from "./components/home/HomeScene";
import { LobbyScene } from "./components/lobby/LobbyScene";
import { TestScene } from "./components/test/TestScene";
import { GameplayScene } from "./components/gameplay/GameplayScene";
import { ResultsScene } from "./components/results/ResultsScene";
import { BotsWindow } from "./components/bots/BotsWindow";
import { ChatWindow } from "./components/chat/ChatWindow";
import { CreateAccountWindow } from "./components/login/create_account/CreateAccountWindow";
import { SignInWindow } from "./components/login/sign_in/SignInWindow";
import { InfoWindow } from "./components/info/InfoWindow";
import { NotificationWindow } from "./components/notification/NotificationWindow";
import { PartyWindow } from "./components/party/PartyWindow";
import { ProfileWindow } from "./components/profile/ProfileWindow";
import { RankWindow } from "./components/rank/RankWindow";
import { SetupWindow } from "./components/setup/SetupWindow";
import { SettingsWindow } from "./components/settings/SettingsWindow";
import { StatsWindow } from "./components/stats/StatsWindow";
import Dev from "./Dev";

export default function App() {
	const { clientUuid, getProfileData } = useProfileStore();
	const data = getProfileData(clientUuid!);

	const { currentScene, showWindow, setShowWindow } = useSceneStore();
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});

		const validateAuth = async () => {
			try {
				await fetchValidate();
			} catch(err) {
				console.log(err);
			}
		};
		validateAuth();

		if (currentScene != "LOGIN") {
			if (!data?.name)
				setShowWindow("setup", true);
			if (!partySocket.isSocketActive())
				partySocket.connect();
		}
	}, [currentScene]);

	const { id } = useNotificationStore();
	const { showDevSection, showStats } = useDevStore();

	return (
		<>
			{ (currentScene === "LOGIN" || currentScene === "HOME") && <StripeBg /> }
			{showStats && <Stats />}
			<section className="
				z-0
				absolute top-0 left-1/2 -translate-x-1/2
				w-full min-w-80 max-w-360
				h-full min-h-120 max-h-360
			">
				{ (currentScene === "LOGIN" || currentScene === "HOME") && 
					<Canvas>
						<AdaptiveDpr />
						<ambientLight intensity={0.5} />
						<directionalLight position={[0, 5, 5]} intensity={0.5} />
						{ currentScene === "LOGIN" &&
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
			<section className="cont-body">
				{ currentScene === 'LOGIN' && <LoginScene /> }
				{ currentScene === 'HOME' && <HomeScene /> }
				{ currentScene === 'LOBBY' && <LobbyScene /> }
				{ currentScene === 'TEST' && <TestScene /> }
				{ currentScene === 'GAMEPLAY' && <GameplayScene /> }
				{ currentScene === 'RESULTS' && <ResultsScene /> }
				{ showWindow["bots"] && <BotsWindow /> }
				{ showWindow["chat"] && <ChatWindow /> }
				{ showWindow["createAccount"] && <CreateAccountWindow /> }
				{ showWindow["info"] && <InfoWindow /> }
				{ showWindow["notification"] && <NotificationWindow key={id}/> }
				{ showWindow["party"] && <PartyWindow /> }
				{ showWindow["profile"] && <ProfileWindow /> }
				{ showWindow["rank"] && <RankWindow /> }
				{ showWindow["setup"] && <SetupWindow /> }
				{ showWindow["settings"] && <SettingsWindow /> }
				{ showWindow["signIn"] && <SignInWindow /> }
				{ showWindow["stats"] && <StatsWindow /> }
			</section>
			{ showDevSection && <Dev /> }
		</>
	);
}