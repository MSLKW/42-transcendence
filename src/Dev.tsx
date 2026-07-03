import { useEffect } from "react";
import { useSceneStore } from "./store/useSceneStore";
import { usePlayerStore } from "./store/usePlayerStore";
import { useDevStore } from "./store/useDevStore";

export default function Dev() {
	const currentScene = useSceneStore((state) => state.currentScene);
	const setCurrentScene = useSceneStore((state) => state.setCurrentScene);
	const resetGame = useSceneStore((state) => state.resetGame);
	const setShowFrame = useDevStore((state) => state.setShowFrame);
	const setShowStats = useDevStore((state) => state.setShowStats);
	const partyCount = usePlayerStore((state) => state.partyCount);
	const setPartyCount = usePlayerStore((state) => state.setPartyCount);
	
	const showFrame = useDevStore((state) => state.showFrame);
	useEffect(() => {
		if (showFrame)
			document.documentElement.classList.add('debug-mode');
		else
			document.documentElement.classList.remove('debug-mode');
	}, [showFrame]);

	const test = usePlayerStore((state) => state.test);
	useEffect(() => {
		console.log("partyCount", partyCount);
	}, [currentScene]);

	const handleParty1 = () => {
		setPartyCount(1);
	};
	const handleParty2 = () => {
		setPartyCount(2);
	};
	const handleParty3 = () => {
		setPartyCount(3);
	};
	const handleParty4 = () => {
		setPartyCount(4);
	};

	return (
		<section className="w-full h-fit">
			<ul className="ul-dev flex-wrap gap-x-5">
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('LOGIN')}>Login</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('HOME')}>Home</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('LOBBY')}>Lobby</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('GAMEPLAY')}>Gameplay</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('R3F')}>R3F</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('RESULTS')}>Results</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => resetGame()}>Reset</button></li>
			</ul>
			<ul className="ul-dev">
				<li><button type="button" tabIndex={-1} onClick={setShowFrame}>Frame</button></li>
				<li><button type="button" tabIndex={-1} onClick={setShowStats}>Stats</button></li>
			</ul>
			<ul className="ul-dev">
				<li><button type="button" tabIndex={-1} onClick={handleParty1}>Party 1</button></li>
				<li><button type="button" tabIndex={-1} onClick={handleParty2}>Party 2</button></li>
				<li><button type="button" tabIndex={-1} onClick={handleParty3}>Party 3</button></li>
				<li><button type="button" tabIndex={-1} onClick={handleParty4}>Party 4</button></li>
			</ul>
		</section>
	);
}