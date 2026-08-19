import { useGameStore } from "../../../store/GameStore";
import { useProfileStore } from "../../../store/ProfileStore";

export const GamePassButton = () => {
	const { seats, activeSeat, nextTurn } = useGameStore();
	const { clientUuid } = useProfileStore();
	
	const clientSeat = seats.indexOf(clientUuid);

	return (
		<button
			onClick={nextTurn}
			disabled={activeSeat !== clientSeat}
			className="
				btn-text bg-light
				h-3rem aspect-5/1
			"
		>
			PASS
		</button>
	);
}