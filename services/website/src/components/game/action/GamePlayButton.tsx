// import { useGameStore, HAND_VALUES } from "../../../store/GameStore";
import { useGameStore } from "../../../store/GameStore";
import { useAuthStore } from "../../../store/AuthStore";
import { gameInstance } from "../../../api/game/src/main";

export const GamePlayButton = () => {
	// const currentHand = useGameStore((store) => store.currentHand);
	// const cardsLeft = useGameStore((store) => store.cardsLeft);
	const gameSeats = useGameStore((store) => store.gameSeats);
	const activeSeat = useGameStore((store) => store.activeSeat);
	// const skipTurn = useGameStore((store) => store.skipTurn);
	const clientUuid = useAuthStore((store) => store.clientUuid);

	const clientSeat = gameSeats.indexOf(clientUuid);

	const handlePlay = () => {
		// const newCardsLeft = [...cardsLeft];
		// const clientCardsLeft = Math.max(0, newCardsLeft[clientSeat] - HAND_VALUES[currentHand]);
		// newCardsLeft[clientSeat] = clientCardsLeft;
		// useGameStore.setState({ cardsLeft: newCardsLeft });

		// if (clientCardsLeft > 0)
		// 	nextTurn();
		gameInstance?.playerRef?.sendCardsButtonHandler();
	};

	return (
		<button
			onClick={handlePlay}
			disabled={activeSeat !== clientSeat}
			className="
				btn-text bg-light
				h-3rem aspect-5/1
			"
		>
			PLAY
		</button>
	);
}