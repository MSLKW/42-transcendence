import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, PerspectiveCamera, OrbitControls, AdaptiveDpr } from "@react-three/drei";
import { useDevStore } from "./store/DevStore";
import { useSceneStore } from "./store/SceneStore";
import { StripeBg } from "./components/bg/StripeBg";
import { SphereBg } from "./components/bg/SphereBg";
import { Card } from "./components/PCard";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Lobby } from "./pages/Lobby";
import { Gameplay } from "./pages/Gameplay";
import { R3F } from "./pages/R3F";
import { Results } from "./pages/Results";
import { InfoWindow } from "./components/Info";
import { ProfileWindow } from "./components/ProfileWindow";
import { StatsWindow } from "./components/StatsWindow";
import { SignInWindow } from "./components/window/SignIn";
import { CreateAccountWindow } from "./components/window/CreateAccount";
import { SettingsWindow } from "./components/Settings";
import { ChatWindow } from "./components/Chat";
import { PartyWindow } from "./components/Party";
import { RankWindow } from "./components/RankButton";

export default function App() {
	const currentScene = useSceneStore((state) => state.currentScene);
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, [currentScene]);
	const showWindow = useSceneStore((state) => state.showWindow);
	const showStats = useDevStore((devStore) => devStore.showStats);

	return (
		<>
			{ (currentScene === "LOGIN" || currentScene === "HOME") && <StripeBg /> }
			{showStats && <Stats />}
			<section className="cont-canvas">
				<Canvas>
					{ (currentScene === "LOGIN" || currentScene === "LOBBY" || currentScene === "R3F" || currentScene === "RESULTS") && 
						<>
							<AdaptiveDpr />
							<ambientLight intensity={0.5}/>
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
							<OrbitControls enableZoom={false}/>
						</>
					}
				</Canvas>
			</section>
			{ currentScene === 'LOGIN' && <Login /> }
			{ currentScene === 'HOME' && <Home /> }
			{ currentScene === 'LOBBY' && <Lobby /> }
			{ currentScene === 'GAMEPLAY' && <Gameplay /> }
			{ currentScene === 'R3F' && <R3F /> }
			{ currentScene === 'RESULTS' && <Results /> }
			{ showWindow["createAccount"] && <CreateAccountWindow /> }
			{ showWindow["signIn"] && <SignInWindow /> }
			{ showWindow["profile"] && <ProfileWindow /> }
			{ showWindow["stats"] && <StatsWindow /> }
			{ showWindow["info"] && <InfoWindow /> }
			{ showWindow["settings"] && <SettingsWindow /> }
			{ showWindow["chat"] && <ChatWindow /> }
			{ showWindow["party"] && <PartyWindow /> }
			{ showWindow["rank"] && <RankWindow /> }
		</>
	);
}