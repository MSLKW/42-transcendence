import { useSceneStore } from "../../store/SceneStore";
import { PartyIcon } from "./PartyIcon";
import { AvatarName } from "../avatar/AvatarName";

export const PartyButton = () => {
	const { showWindow, setShowWindow } = useSceneStore();

	return (
		<div
			className="
				flex flex-col place-content-center place-items-center
				gap-0.75rem
			"
		>
			<button 
				data-tip="Add To Party"
				onClick={(e) => {
					e.currentTarget.blur();
					setShowWindow("party", !showWindow.party);
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
					<PartyIcon />
				</div>
			</button>
			<AvatarName name="Party" />
		</div>
	);
}