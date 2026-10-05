import { useSceneStore } from "../../../store/SceneStore";
import { Tooltip } from "../../../utilities/react/Tooltip";
import { PartyIcon } from "./PartyCallIcon";
import { AvatarName } from "../../avatar/name/AvatarName";

export const PartyCallButton = () => {
	const showWindow = useSceneStore((store) => store.showWindow);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);

	return (
		<div className="
			flex flex-col place-content-center place-items-center
			gap-0.75rem
		">
			<Tooltip text="Find Players">
				<button
					onClick={(e) => {
						e.currentTarget.blur();
						setShowWindow("party", !showWindow.party);
					}}
					className="
						h-6rem aspect-square
						bg-dark-semi btn-icon rounded-sm
						flex place-content-center place-items-center
					"
				>
					<PartyIcon />
				</button>
			</Tooltip>
			<AvatarName name="Party" />
		</div>
	);
}