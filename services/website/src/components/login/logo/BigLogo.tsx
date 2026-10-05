import { useSceneStore } from "../../../store/SceneStore";
import { Tooltip } from "../../../utilities/react/Tooltip";

export const BigLogo = () => {
	const showWindow = useSceneStore((store) => store.showWindow);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);

	return (
		<div className="
			flex flex-col place-content-center place-items-center
		">
			<div className="
				flex place-content-center place-items-center
				gap-2rem
				mb-[clamp(1.25rem,3.846vh+0.096rem,2.5rem)]
			">
				<span className="
					text-[clamp(4rem,5.714vmin+2.857rem,8rem)]
					font-extrabold
					text-n6
					tracking-[clamp(2.5rem,3.571vw+1.786rem,5rem)]
				">
					BIG
				</span>
				<span className="
					text-[clamp(8rem,11.429vmin+5.714rem,16rem)]
					font-extrabold
					text-n6
					leading-[clamp(6rem,8.571vmin+4.286rem,12rem)]
				">
					2
				</span>
			</div>
			<Tooltip text="About This Project">
				<button
					onClick={() => setShowWindow("info", !showWindow.info)}
					className="
						btn-text
						border border-transparent hover:not-disabled:border-n6
						text-1.5rem text-b5 focus-visible:text-n6 hover:text-n6 font-extralight tracking-widest whitespace-nowrap
						h-4rem aspect-8/1
						outline-n6
				">
					A 42 TRANSCENDENCE PROJECT
				</button>
			</Tooltip>
		</div>
	);
}