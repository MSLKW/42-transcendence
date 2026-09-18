import { useGameStore } from "../../../store/GameStore";
import { useAuthStore } from "../../../store/AuthStore";

export const GamePassButton = () => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const seats = useGameStore((store) => store.seats);
	const activeSeat = useGameStore((store) => store.activeSeat);
	const isActiveSeatSkippable = useGameStore((store) => store.isActiveSeatSkippable);
	const skipTurn = useGameStore((store) => store.skipTurn);
	
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