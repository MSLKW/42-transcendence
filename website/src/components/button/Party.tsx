import { useSceneStore } from "../../store/SceneStore";
import { AddIcon } from "../icon/Add";

export const PartyButton = () => {
	const setShowWindow = useSceneStore((scene) => scene.setShowWindow);

	return (
		<button 
			data-tip="Add / Join Party"
			onClick={(e) => {
				setShowWindow("party", true);
				e.currentTarget.blur();
			}}
			className="
				btn-avatar btn-tip-up
				flex flex-col place-items-center
				gap-1
		">
			<div
				className="
					h-[clamp(2.5rem,7.5vh+0.5rem,5rem)] aspect-square
					bg-n1
					border border-n2 rounded-sm
					text-b5
					p-3
					flex place-content-center place-items-center
			">
				<AddIcon />
			</div>
			<div className="
				w-max min-w-[clamp(2.5rem,7.5vh+0.5rem,5rem)] max-w-32.5
				h-fit
				bg-n1
				border border-n2 rounded-3xl
				text-[clamp(0.25rem,1.5vh+0.125rem,1rem)]
				text-n6
				truncate
				flex place-content-center place-items-center
				px-[clamp(0.625rem,1vh+0.3125rem,1.25rem)]
			">
				<p>Add</p>
			</div>
		</button>
	);
}