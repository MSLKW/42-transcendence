import { useSceneStore } from "../../../store/SceneStore";
import { PartyIcon } from "./PartyCallIcon";
import { AvatarName } from "../../avatar/name/AvatarName";

export const PartyCallButton = () => {
	const { showWindow, setShowWindow } = useSceneStore();

	return (
		<div
			className="
				flex flex-col place-content-center place-items-center
				gap-0.75rem
			"
		>
			<button 
				data-tip="Find Players"
				onClick={(e) => {
					e.currentTarget.blur();
					setShowWindow("party", !showWindow.party);
				}}
				className="
					h-6rem aspect-square
					bg-dark btn-icon rounded-sm
					data-tip-up
					flex place-content-center place-items-center
				"
			>
				<PartyIcon />
			</button>
			<AvatarName name="Party" />
		</div>
	);
}