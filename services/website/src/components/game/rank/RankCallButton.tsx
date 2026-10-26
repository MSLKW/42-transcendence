import { useGameStore } from "../../../store/GameStore";
import { useSceneStore } from "../../../store/SceneStore";
import { Tooltip } from "../../../utilities/react/Tooltip";
import { RankIcon } from "./RankIcon";

export const RankCallButton = () => {
	const setShowWindow = useSceneStore((store) => store.setShowWindow);
	const currentHand = useGameStore((store) => store.currentHand);

	return (
		<Tooltip text="View Rank List">
			<button
				onClick={() => setShowWindow("rank", true)}
				className="
					btn-text bg-dark-semi
					h-max w-max
					flex place-content-between place-items-center
			">
				<div className="
					h-full w-full
					py-0.5rem px-2rem
					text-n6
					relative
				">
					<h3>{currentHand}</h3>
				</div>
				<div className="h-10 aspect-square text-b5">
					<RankIcon />
				</div>
			</button>
		</Tooltip>
	);
}