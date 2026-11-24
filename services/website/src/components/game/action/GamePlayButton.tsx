import { useGameStore } from "../../../store/GameStore";
import { useAuthStore } from "../../../store/AuthStore";
import { gameInstance } from "../../../api/game/main";
import { useUiSoundProps } from "../../../utilities/react/useUiSoundProps";

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
			type="button"
			disabled={!(activeSeat === clientSeat && isCardHandPlayable === true)}
			{...useUiSoundProps()}
			onClick={handlePlay}
			className="
				btn-text bg-light
				h-3rem aspect-5/1
		">
			PLAY
		</button>
	);
}