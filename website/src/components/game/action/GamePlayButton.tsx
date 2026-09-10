import { useGameStore, HAND_VALUES } from "../../../store/GameStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { gameInstance } from "../../../api/game/src/main";

export const GamePlayButton = () => {
	const { currentHand, cardsLeft, seats, activeSeat, nextTurn } = useGameStore();
	const { clientUuid } = useProfileStore();

	const clientSeat = seats.indexOf(clientUuid);

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