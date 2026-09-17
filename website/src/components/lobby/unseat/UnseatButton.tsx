
import { useAuthStore } from "../../../store/AuthStore";
import { useGameStore } from "../../../store/GameStore";
import { AvatarName } from "../../avatar/name/AvatarName";
import { UnseatIcon } from "./UnseatIcon";

interface UnseatButtonProps {
	uuid: string;
}

export const UnseatButton = ({ uuid }: UnseatButtonProps) => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const playerUnseats = useGameStore((store) => store.playerUnseats);
	const seats = useGameStore((store) => store.seats);

	return (
		<div
			className="
				flex flex-col place-content-center place-items-center
				gap-0.75rem
			"
		>
			<button 
				data-tip="Sit out from game"
				disabled={!seats.includes(clientUuid)}
				onClick={(e) => {
					e.currentTarget.blur();
					playerUnseats(uuid);
				}}
				className="
					h-6rem aspect-square
					bg-dark btn-icon rounded-sm
					data-tip-up
					flex place-content-center place-items-center
				"
			>
				<UnseatIcon />
			</button>
			<AvatarName name="Unseat"/>
		</div>
	);
}