import { useEffect } from "react";
import { useSceneStore } from "./store/useSceneStore";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Lobby } from "./pages/Lobby";
import { Gameplay } from "./pages/Gameplay";
import { R3F } from "./pages/R3F";
import { Results } from "./pages/Results";
import { InfoWindow } from "./components/Info";
import { StatsWindow } from "./components/StatsWindow";
import { SignInWindow } from "./components/SignIn";
import { CreateAccountWindow } from "./components/CreateAccount";
import { SettingsWindow } from "./components/Settings";
import { ChatWindow } from "./components/Chat";
import { PartyWindow } from "./components/Party";
import { RankWindow } from "./components/RankButton";

export default function App() {
	const currentScene = useSceneStore((state) => state.currentScene);
	const showWindow = useSceneStore((state) => state.showWindow);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, [currentScene]);

	return (
		<>
			{ currentScene === 'LOGIN' && <Login /> }
			{ currentScene === 'HOME' && <Home /> }
			{ currentScene === 'LOBBY' && <Lobby /> }
			{ currentScene === 'GAMEPLAY' && <Gameplay /> }
			{ currentScene === 'R3F' && <R3F /> }
			{ currentScene === 'RESULTS' && <Results /> }
			{ showWindow["createAccount"] && <CreateAccountWindow /> }
			{ showWindow["signIn"] && <SignInWindow /> }
			{ showWindow["stats"] && <StatsWindow /> }
			{ showWindow["info"] && <InfoWindow /> }
			{ showWindow["settings"] && <SettingsWindow /> }
			{ showWindow["chat"] && <ChatWindow /> }
			{ showWindow["party"] && <PartyWindow /> }
			{ showWindow["rank"] && <RankWindow /> }
		</>
	);
}