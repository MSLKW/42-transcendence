import { useGameStore, HAND_VALUES } from "../../../store/GameStore";
import { useAuthStore } from "../../../store/AuthStore";

export const GamePlayButton = () => {
	const currentHand = useGameStore((store) => store.currentHand);
	const cardsLeft = useGameStore((store) => store.cardsLeft);
	const seats = useGameStore((store) => store.seats);
	const activeSeat = useGameStore((store) => store.activeSeat);
	const nextTurn = useGameStore((store) => store.nextTurn);
	const clientUuid = useAuthStore((store) => store.clientUuid);

	const clientSeat = seats.indexOf(clientUuid);

	const handlePlay = () => {
		const newCardsLeft = [...cardsLeft];
		const clientCardsLeft = Math.max(0, newCardsLeft[clientSeat] - HAND_VALUES[currentHand]);
		newCardsLeft[clientSeat] = clientCardsLeft;
		useGameStore.setState({ cardsLeft: newCardsLeft });

		if (clientCardsLeft > 0)
			nextTurn();
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