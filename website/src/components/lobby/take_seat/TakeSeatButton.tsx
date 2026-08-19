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
					rounded-xs
					hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
					focus-visible:outline-2 outline-b5
					data-tip-up
					cursor-pointer
				"
			>
				<div
					className="
						h-[clamp(2.5rem,7.5vh+0.5rem,5rem)] aspect-square
						bg-dark border-b5 rounded-sm
						flex place-content-center place-items-center
				">
					<TakeSeatIcon />
				</div>
			</button>
			<AvatarName name={`Take Seat ${seatNumber}`} style="seat"/>
		</div>
	);
}