import { useSceneStore } from "../../store/SceneStore";
import { AddIcon } from "../icon/Add";

export const PartyButton = () => {
	const { showWindow, setShowWindow } = useSceneStore();

	return (
		<button 
			data-tip="Add To Party"
			onClick={(e) => {
				setShowWindow("party", !showWindow.party);
				e.currentTarget.blur();
			}}
			className="
				rounded-xs h-full
				hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
				focus-visible:outline-2 btn-tip-up
				flex flex-col place-items-center
				gap-0.5rem
			"
		>
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
				<h3>Add</h3>
			</div>
		</button>
	);
}