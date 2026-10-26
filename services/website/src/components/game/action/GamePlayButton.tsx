// import { useGameStore, HAND_VALUES } from "../../../store/GameStore";
import { useGameStore } from "../../../store/GameStore";
import { useAuthStore } from "../../../store/AuthStore";
import { gameInstance } from "../../../api/game/main";

export const GamePlayButton = () => {
	const gameSeats = useGameStore((store) => store.gameSeats);
	const activeSeat = useGameStore((store) => store.activeSeat);
	const isCardHandPlayable = useGameStore((store) => store.isCardHandPlayable);
	const clientUuid = useAuthStore((store) => store.clientUuid);

	const clientSeat = gameSeats.indexOf(clientUuid);

	const handlePlay = () => {
		gameInstance?.playerRef?.sendCardsButtonHandler();
	};

	return (
		<button
			onClick={handlePlay}
			disabled={!(activeSeat === clientSeat && isCardHandPlayable === true)}
			className="
				btn-text bg-light
				h-3rem aspect-5/1
			"
		>
			PLAY
		</button>
	);
}