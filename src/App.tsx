import { useGameStore } from "./store/useGameStore";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Lobby } from "./pages/Lobby";
import { Gameplay } from "./pages/Gameplay";
import { R3F } from "./pages/R3F";
import { Results } from "./pages/Results";

function App() {
	const currentScene = useGameStore((state) => state.currentScene);

	return (
		<>
			{currentScene === 'LOGIN' && <Login />}
			{currentScene === 'HOME' && <Home />}
			{currentScene === 'LOBBY' && <Lobby />}
			{currentScene === 'GAMEPLAY' && <Gameplay />}
			{currentScene === 'R3F' && <R3F />}
			{currentScene === 'RESULTS' && <Results />}
		</>
	)
}

export default App
