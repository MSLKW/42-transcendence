import { useSceneStore } from "../../store/SceneStore";
import { RankIcon } from "../icon/Rank";

export const RankButton = () => {
	const { setShowWindow } = useSceneStore();

	return (
		<button
			data-tip="View Rank List"
			onClick={() => setShowWindow("rank", true)}
			className="
				h-max w-max
				btn-icon-border btn-tip-down
				hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
				focus-visible:outline-2
				flex place-content-between place-items-center
			"
		>
			<div className="
				h-full w-full
				px-[clamp(0.25rem,2vw+0.125rem,1.25rem)]
				text-n6
				relative
			">
				<p>Straight</p>
			</div>
			<div className="h-10 aspect-square text-b5">
				<RankIcon />
			</div>
		</button>
	);
}