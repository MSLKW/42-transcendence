import { useGameStore } from "../../../store/GameStore";
import { AvatarName } from "../../avatar/name/AvatarName";
import { TakeSeatIcon } from "./TakeSeatIcon";

interface TakeSeatButtonProps {
	uuid: string,
	seatNumber: number,
}
export const TakeSeatButton = ({ uuid, seatNumber }: TakeSeatButtonProps ) => {
	const { setSeatWithUuid } = useGameStore();
	return (
		<div
			className="
				flex flex-col place-content-center place-items-center
				gap-0.75rem
			"
		>
			<button 
				data-tip="Choose this seat"
				onClick={(e) => {
					e.currentTarget.blur();
					setSeatWithUuid(uuid, seatNumber);
				}}
				className="
					h-6rem aspect-square
					bg-dark btn-icon rounded-sm
					data-tip-up
					flex place-content-center place-items-center
				"
			>
				<TakeSeatIcon />
			</button>
			<AvatarName name={`Take Seat ${seatNumber}`}/>
		</div>
	);
}