import { useSceneStore } from "../store/SceneStore";

export const BigLogo = () => {
	const { showWindow, setShowWindow } = useSceneStore();

	return (
		<div className="
			flex flex-col place-content-center place-items-center
		">
			<div className="
				flex place-content-center place-items-center
				mb-[clamp(1.25rem,3.846vh+0.096rem,2.5rem)]
			">
				<span className="
					text-[clamp(4rem,5.714vmin+2.857rem,8rem)]
					font-semibold
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
			<button
				data-tip="About This Project"
				onClick={() => setShowWindow("info", !showWindow.info)}
				className="
					btn-text
					border border-transparent hover:not-disabled:border-n6
					text-1.5rem text-b5 focus-visible:text-n6 hover:text-n6 font-extralight tracking-widest whitespace-nowrap
					h-4rem aspect-8/1
					outline-n6
					btn-tip-down
			">
				A 42 TRANSCENDENCE PROJECT
			</button>
		</div>
	);
}

export const SmallLogo = () => {
	const { setShowWindow } = useSceneStore();
	return (
		<button
			data-tip="About This Project"
			onClick={() => setShowWindow("info", true)}
			className="
				btn-text rounded-xl
				border border-transparent hover:not-disabled:border-b5
				absolute z-0 top-1/2 -translate-y-1/2 right-0
				flex flex-col place-items-end
				py-1rem px-1.5rem
				hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
				btn-tip-up
		">
			<div className="
				flex place-items-center
			">
				<span className="
					text-2.5rem
					tracking-[clamp(1rem,1.429vmin+0.714rem,2rem)]
					font-semibold text-n6
				">
					BIG
				</span>
				<span className="
					text-4rem
					leading-[clamp(1.5rem,4.615vmin+0.115rem,3rem)]
					font-extrabold text-n6
				">
					2
				</span>
			</div>
			<span className="
				text-[clamp(0.375rem,1.154vmin+0.029rem,0.75rem)]
				text-b5 font-light text-right tracking-widest whitespace-nowrap leading-6
			">
				A 42 TRANSCENDENCE PROJECT
			</span>
		</button>
	);
}