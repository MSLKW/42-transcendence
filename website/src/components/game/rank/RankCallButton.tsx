import { useGameStore } from "../../../store/GameStore";
import { useSceneStore } from "../../../store/SceneStore";
import { RankIcon } from "./RankIcon";

export const RankCallButton = () => {
	const { setShowWindow } = useSceneStore();
	const { currentHand } = useGameStore();

	return (
		<button
			data-tip="View Rank List"
			onClick={() => setShowWindow("rank", true)}
			className="
				btn-text bg-dark
				data-tip-up
				h-max w-max
				flex place-content-between place-items-center
			"
		>
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
	);
}