import { useEffect } from "react";
import { useSceneStore } from "./store/useSceneStore";
import { useDevStore } from "./store/DevStore";
import { useGameStore } from "./store/useGameStore";
import { usePartyStore } from "./store/PartyStore";

export default function Dev() {
	const currentScene = useSceneStore((state) => state.currentScene);
	const setCurrentScene = useSceneStore((state) => state.setCurrentScene);
	const resetGame = useSceneStore((state) => state.resetGame);

	const { showFrame, toggleFlag } = useDevStore();
	useEffect(() => {
		if (showFrame)
			document.documentElement.classList.add('frame-mode');
		else
			document.documentElement.classList.remove('frame-mode');
	}, [showFrame]);

	const gameStarted = useGameStore((state) => state.gameStarted);
	useEffect(() => {
		console.log("gameStarted", gameStarted);
	}, [currentScene]);
	const setPartyCount = usePartyStore((state) => state.setPartyCount);
	const setNameList = usePartyStore((state) => state.setNameList);

	const handleParty = (count: number, players: string[]) => {
		setPartyCount(count);
		setNameList(players);
	};

	return (
		<section className="w-full h-fit">
			<ul className="ul-dev flex-wrap gap-x-5">
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('LOGIN')}>Login</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('HOME')}>Home</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('LOBBY')}>Lobby</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('GAMEPLAY')}>Gameplay</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('R3F')}>R3F</button></li>
			</ul>
			<ul className="ul-dev">
				<li><button type="button" tabIndex={-1} onClick={() => toggleFlag("showFrame")}>Frame</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => toggleFlag("showStats")}>Stats</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => setCurrentScene('RESULTS')}>Results</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => resetGame()}>Reset</button></li>
			</ul>
			<ul className="ul-dev">
				<li><button type="button" tabIndex={-1} onClick={() => handleParty(1, ["Azrul", "Void", "Null", "Undefined"])}>Party 1</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => handleParty(2, ["Azrul", "Max", "Null", "Undefined"])}>Party 2</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => handleParty(3, ["Azrul", "Max", "Jeremy", "Undefined"])}>Party 3</button></li>
				<li><button type="button" tabIndex={-1} onClick={() => handleParty(4, ["Azrul", "Max", "Jeremy", "Aisyah"])}>Party 4</button></li>
			</ul>
		</section>
	);
}