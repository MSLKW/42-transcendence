import { useSceneStore } from "../../../store/SceneStore";
import { AvatarName } from "../../avatar/name/AvatarName";
import { ResultsIcon } from "./ResultsIcons";

export const ResultsCallButton = () => {
	const { setShowWindow } = useSceneStore();

	return (
		<div
			className="
				flex flex-col place-content-center place-items-center
				gap-0.75rem
			"
		>
			<button 
				data-tip="View Results"
				onClick={() => setShowWindow("results", true)}
				className="
					h-5rem aspect-square
					bg-dark btn-icon rounded-sm
					data-tip-up
					flex place-content-center place-items-center
				"
			>
				<ResultsIcon />
			</button>
			<AvatarName name="Results" />
		</div>
	);
}