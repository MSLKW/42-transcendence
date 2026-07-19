import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, PerspectiveCamera, OrbitControls, AdaptiveDpr } from "@react-three/drei";
import { useDevStore } from "./store/DevStore";
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
import { CreateAccountWindow } from "./window/CreateAccount";
import { InfoWindow } from "./window/Info";
import { NotificationWindow } from "./window/Notification";
import { PartyWindow } from "./window/Party";
import { ProfileWindow } from "./window/Profile";
import { RankWindow } from "./window/Rank";
import { SetupWindow } from "./window/Setup";
import { SettingsWindow } from "./window/Settings";
import { SignInWindow } from "./window/SignIn";
import { StatsWindow } from "./window/Stats";
import { useNotificationStore } from "./store/NotificationStore";

export default function App() {
	const { data } = usePlayerStore();

	const { setContAreaHeight, setContAreaWidth, currentScene, showWindow, setShowWindow } = useSceneStore();
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		if (!data.name && currentScene != "LOGIN")
			setShowWindow("setup", true);
	}, [currentScene]);

	const containerRef = useRef(null);
	useEffect(() => {
		if (!containerRef.current)
			return;

		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				setContAreaWidth(entry.target.scrollWidth);
				setContAreaHeight(entry.target.scrollHeight);
			}
		});
		observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, []);

	const showStats = useDevStore((devStore) => devStore.showStats);

	const { id } = useNotificationStore();

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
		</>
	);
}