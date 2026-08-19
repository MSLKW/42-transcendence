
import { useGameStore } from "../../../store/GameStore";
import { AvatarName } from "../../avatar/name/AvatarName";
import { UnseatIcon } from "./UnseatIcon";

interface UnseatButtonProps {
	uuid: string,
}
export const UnseatButton = ({ uuid }: UnseatButtonProps) => {
	const { playerUnseats } = useGameStore();
	return (
		<div
			className="
				flex flex-col place-content-center place-items-center
				gap-0.75rem
			"
		>
			<button 
				data-tip="Sit out from game"
				onClick={(e) => {
					e.currentTarget.blur();
					playerUnseats(uuid);
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
						bg-dark rounded-sm
						flex place-content-center place-items-center
				">
					<UnseatIcon />
				</div>
			</button>
			<AvatarName name="Unseat" style="seat"/>
		</div>
	);
}