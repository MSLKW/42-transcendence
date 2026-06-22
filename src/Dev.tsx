import { useGameStore } from './store/useGameStore';

export default function Dev() {
	const setScene = useGameStore((state) => state.setScene);

	return (
		<section className="w-full h-15">
			<ul className="ul-dev">
				<li><button type="button" onClick={() => setScene('LOGIN')}>Login</button></li>
				<li><button type="button" onClick={() => setScene('HOME')}>Home</button></li>
				<li><button type="button" onClick={() => setScene('LOBBY')}>Lobby</button></li>
				<li><button type="button" onClick={() => setScene('GAMEPLAY')}>Gameplay</button></li>
				<li><button type="button" onClick={() => setScene('R3F')}>R3F</button></li>
				<li><button type="button" onClick={() => setScene('RESULTS')}>Results</button></li>
			</ul>
			<ul className="ul-dev">
				<li><button type="button">Frame</button></li>
				<li><button type="button">Stats</button></li>
			</ul>
		</section>
	);
}