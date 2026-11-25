import { useGameStore } from "../../../store/GameStore";
import { useAuthStore } from "../../../store/AuthStore";
import { useUiSoundProps } from "../../../utilities/react/useUiSoundProps";

export const GamePassButton = () => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const gameSeats = useGameStore((store) => store.gameSeats);
	const activeSeat = useGameStore((store) => store.activeSeat);
	const isActiveSeatSkippable = useGameStore((store) => store.isActiveSeatSkippable);
	const skipTurn = useGameStore((store) => store.skipTurn);
	
	const clientSeat = gameSeats.indexOf(clientUuid);

	return (
		<button
			type="button"
			disabled={activeSeat !== clientSeat || (activeSeat === clientSeat && isActiveSeatSkippable === false)}
			{...useUiSoundProps({ upSound: "pass" })}
			onClick={skipTurn}
			className="
				btn-text bg-light
				h-3rem aspect-5/1
		">
			PASS
		</button>
	);
}