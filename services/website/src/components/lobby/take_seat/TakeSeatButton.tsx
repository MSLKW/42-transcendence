import { useGameStore } from "../../../store/GameStore";
import { Tooltip } from "../../../utilities/react/Tooltip";
import { AvatarName } from "../../avatar/name/AvatarName";
import { TakeSeatIcon } from "./TakeSeatIcon";
interface TakeSeatButtonProps {
	seatNumber: number;
}
export const TakeSeatButton = ({ seatNumber }: TakeSeatButtonProps ) => {
	const takeSeat = useGameStore((store) => store.takeSeat);

	return (
		<div className="
			flex flex-col place-content-center place-items-center
			gap-0.75rem
		">
			<Tooltip text="Choose this seat">
				<button
					onClick={(e) => {
						e.currentTarget.blur();
						takeSeat(seatNumber);
					}}
					className="
						h-6rem aspect-square
						bg-dark-semi btn-icon rounded-sm
						flex place-content-center place-items-center
				">
					<TakeSeatIcon />
				</button>
			</Tooltip>
			<AvatarName name={`Take Seat ${seatNumber}`}/>
		</div>
	);
}