import { useGameStore } from "../../../store/GameStore";
import { useProfileStore } from "../../../store/ProfileStore";

export const GamePassButton = () => {
	const { seats, activeSeat, isActiveSeatSkippable, skipTurn } = useGameStore();
	const { clientUuid } = useProfileStore();
	
	const clientSeat = seats.indexOf(clientUuid);

	return (
		<button
			onClick={skipTurn}
			disabled={activeSeat !== clientSeat || (activeSeat === clientSeat && isActiveSeatSkippable === false)}
			className="
				btn-text bg-light
				h-3rem aspect-5/1
			"
		>
			PASS
		</button>
	);
}