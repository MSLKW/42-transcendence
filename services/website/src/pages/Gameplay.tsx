<<<<<<< HEAD
import { useEffect, useRef } from 'react';
import { initGame } from '../../../game/src_client/main';
import "../../../game/style.css"

export const Gameplay = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let destroyGame: (() => void) | null = null;

		if (containerRef.current)
			destroyGame = initGame('threejs-canvas');

		return () => {
			if (destroyGame)
				destroyGame();
		};
	}, []);

	return (
		<div className="canvas-container">
			<div id="threejs-canvas" ref={containerRef}>
			</div>
				<button className="ui-misc" id="start-game-button">Start Game</button>
				<div className="ui-action">
					<button id="send-cards-button">Send Cards</button>
					<button id="skip-turn-button">Skip Turn</button>
					<button id="sort-cards-by-rank-button">Sort Rank</button>
					<button id="sort-cards-by-suit-button">Sort Suit</button>
				</div>
		</div>
	);
};
=======
export const TestScene = () => {
	return (
		<section className="h-full">
			<span className="
				text-[clamp(8rem,11.429vmin+5.714rem,16rem)]
				font-extrabold
				text-n6
			">
				Test
			</span>
		</section>
	);
}
>>>>>>> origin/int/KAN-36-website-db
