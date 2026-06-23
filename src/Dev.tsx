import { useGameStore } from './store/useGameStore';
import { useDevStore } from './store/useDevStore';

export default function Dev() {
	const setScene = useGameStore((state) => state.setScene);
	const resetGame = useGameStore((state) => state.resetGame);
	const showFrame = useDevStore((state) => state.setShowFrame);
	const showStats = useDevStore((state) => state.setShowStats);

	return (
		<section className="w-full h-15">
			<ul className="ul-dev">
				<li><button type="button" onClick={() => setScene('LOGIN')}>Login</button></li>
				<li><button type="button" onClick={() => setScene('HOME')}>Home</button></li>
				<li><button type="button" onClick={() => setScene('LOBBY')}>Lobby</button></li>
				<li><button type="button" onClick={() => setScene('GAMEPLAY')}>Gameplay</button></li>
				<li><button type="button" onClick={() => setScene('R3F')}>R3F</button></li>
				<li><button type="button" onClick={() => setScene('RESULTS')}>Results</button></li>
				<li><button type="button" onClick={() => resetGame()}>Reset</button></li>
			</ul>
			<ul className="ul-dev">
				<li><button type="button" onClick={showFrame}>Frame</button></li>
				<li><button type="button" onClick={showStats}>Stats</button></li>
			</ul>
		</section>
	);
}