import { useSceneStore } from "../../../store/SceneStore";
import { PartyIcon } from "./PartyCallIcon";
import { AvatarName } from "../../avatar/name/AvatarName";

export const PartyCallButton = () => {
	const showWindow = useSceneStore((store) => store.showWindow);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);

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
					bg-dark-semi btn-icon rounded-sm
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