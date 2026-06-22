import { useGameStore } from './store/useGameStore';

export default function Dev() {
	const setScene = useGameStore((state) => state.setScene);

	return (
		<section className="w-full h-15">
			<ul className="
				w-full h-full
				flex place-content-evenly place-items-center
				text-r4
			">
				<li>
					<button type="button" className="btn-dev" onClick={() => setScene('LOGIN')}>
						Login
					</button>
				</li>
				<li>
					<button type="button" className="btn-dev" onClick={() => setScene('HOME')}>
						Home
					</button>
				</li>
				<li>
					<button type="button" className="btn-dev" onClick={() => setScene('LOBBY')}>
						Lobby
					</button>
				</li>
				<li>
					<button type="button" className="btn-dev" onClick={() => setScene('GAMEPLAY')}>
						Gameplay
					</button>
				</li>
				<li>
					<button type="button" className="btn-dev" onClick={() => setScene('R3F')}>
						R3F
					</button>
				</li>
				<li>
					<button type="button" className="btn-dev" onClick={() => setScene('RESULTS')}>
						Results
					</button>
				</li>
			</ul>
		</section>
	);
}