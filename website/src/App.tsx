import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, PerspectiveCamera, OrbitControls, AdaptiveDpr } from "@react-three/drei";
import { useDevStore } from "./store/DevStore";
import { useNotificationStore } from "./store/NotificationStore";
import { usePlayerStore } from "./store/PlayerStore";
import { useSceneStore } from "./store/SceneStore";
import { StripeBg } from "./components/bg/Stripe";
import { SphereBg } from "./components/3d/Sphere";
import { Card } from "./components/3d/PCard";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Lobby } from "./pages/Lobby";
import { Gameplay } from "./pages/Gameplay";
import { R3F } from "./pages/R3F";
import { Results } from "./pages/Results";
import { BotsWindow } from "./window/Bots";
import { ChatWindow } from "./window/Chat";
import { CreateAccountWindow } from "./components/create_account/CreateAccount";
import { InfoWindow } from "./components/info/InfoWindow";
import { NotificationWindow } from "./window/Notification";
import { PartyWindow } from "./window/Party";
import { ProfileWindow } from "./components/profile/ProfileWindow";
import { RankWindow } from "./window/Rank";
import { SetupWindow } from "./window/Setup";
import { SettingsWindow } from "./window/Settings";
import { SignInWindow } from "./components/sign_in/SignIn";
import { StatsWindow } from "./components/stats/StatsWindow";
import { partySocket } from "./services/partySocket";

export default function App() {
	const { data } = usePlayerStore();
	useEffect(() => {
		// if (data.uuid)
			partySocket.connect();
		// return () => {
			// partySocket.disconnect();
		// };
	// }, [data.uuid]);
	}, []);

	const { currentScene, showWindow, setShowWindow } = useSceneStore();
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		if (!data.name && currentScene != "LOGIN")
			setShowWindow("setup", true);
	}, [currentScene]);

	const { id } = useNotificationStore();
	const { showStats } = useDevStore();

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
				<Canvas>
					{ (currentScene === "LOGIN" || currentScene === "LOBBY" || currentScene === "R3F" || currentScene === "RESULTS") && 
						<>
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
						</>
					}
				</Canvas>
			</section>
			<section className="cont-body">
				{ currentScene === 'LOGIN' && <Login /> }
				{ currentScene === 'HOME' && <Home /> }
				{ currentScene === 'LOBBY' && <Lobby /> }
				{ currentScene === 'GAMEPLAY' && <Gameplay /> }
				{ currentScene === 'R3F' && <R3F /> }
				{ currentScene === 'RESULTS' && <Results /> }
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
		</>
	);
}