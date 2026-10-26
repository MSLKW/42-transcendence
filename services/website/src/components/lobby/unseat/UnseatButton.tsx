
import { useAuthStore } from "../../../store/AuthStore";
import { useGameStore } from "../../../store/GameStore";
import { Tooltip } from "../../../utilities/react/Tooltip";
import { AvatarName } from "../../avatar/name/AvatarName";
import { UnseatIcon } from "./UnseatIcon";

export const UnseatButton = () => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const seats = useGameStore((store) => store.userSeats);
	const leaveSeat = useGameStore((store) => store.leaveSeat);

	return (
		<div className="
			flex flex-col place-content-center place-items-center
			gap-0.75rem
		">
			<Tooltip text="Sit out from game">
				<button
					disabled={!seats.includes(clientUuid)}
					onClick={(e) => {
						e.currentTarget.blur();
						leaveSeat();
					}}
					className="
						h-6rem aspect-square
						bg-dark-semi btn-icon rounded-sm
						flex place-content-center place-items-center
				">
					<UnseatIcon />
				</button>
			</Tooltip>
			<AvatarName name="Unseat"/>
		</div>
	);
}