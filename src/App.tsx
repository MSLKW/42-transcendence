import { useSceneStore } from "./store/useSceneStore";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Lobby } from "./pages/Lobby";
import { Gameplay } from "./pages/Gameplay";
import { R3F } from "./pages/R3F";
import { Results } from "./pages/Results";
import { InfoWindow } from "./components/Info";
import { StatsWindow } from "./components/StatsWindow";
import { SignInLightbox } from "./components/SignIn";
import { CreateAccountLightbox } from "./components/CreateAccount";
import { SettingsLightbox } from "./components/Settings";
import { ChatLightbox } from "./components/Chat";
import { PartyLightbox } from "./components/Party";
import { RankLightbox } from "./components/RankButton";

export default function App() {
	const currentScene = useSceneStore((state) => state.currentScene);
	const showWindow = useSceneStore((state) => state.showWindow);

	return (
		<>
			{ currentScene === 'LOGIN' && <Login /> }
			{ currentScene === 'HOME' && <Home /> }
			{ currentScene === 'LOBBY' && <Lobby /> }
			{ currentScene === 'GAMEPLAY' && <Gameplay /> }
			{ currentScene === 'R3F' && <R3F /> }
			{ currentScene === 'RESULTS' && <Results /> }
			{ showWindow["createAccount"] && <CreateAccountLightbox /> }
			{ showWindow["signIn"] && <SignInLightbox /> }
			{ showWindow["stats"] && <StatsWindow /> }
			{ showWindow["info"] && <InfoWindow /> }
			{ showWindow["settings"] && <SettingsLightbox /> }
			{ showWindow["chat"] && <ChatLightbox /> }
			{ showWindow["party"] && <PartyLightbox /> }
			{ showWindow["rank"] && <RankLightbox /> }
		</>
	);
}