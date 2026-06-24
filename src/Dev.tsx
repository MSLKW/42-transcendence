import { useGameStore } from './store/useGameStore';
import { useDevStore } from './store/useDevStore';

export default function Dev() {
	const setCurrentScene = useGameStore((state) => state.setCurrentScene);
	const resetGame = useGameStore((state) => state.resetGame);
	const setShowFrame = useDevStore((state) => state.setShowFrame);
	const setShowStats = useDevStore((state) => state.setShowStats);

	const toggleFrame = () => {
		document.documentElement.classList.toggle('debug-mode');
		setShowFrame;
	}

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
				<li><button type="button" tabIndex={-1} onClick={toggleFrame}>Frame</button></li>
				<li><button type="button" tabIndex={-1} onClick={setShowStats}>Stats</button></li>
			</ul>
		</section>
	);
}