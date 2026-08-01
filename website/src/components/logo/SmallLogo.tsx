import { useSceneStore } from "../../store/SceneStore";

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
				data-tip-up
			"
		>
			<div className="
				flex place-items-center
				gap-1rem
			">
				<span className="
					text-2.5rem
					tracking-[clamp(1rem,1.429vmin+0.714rem,2rem)]
					font-extrabold text-n6
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
			<span className="`
				text-[clamp(0.375rem,1.154vmin+0.029rem,0.75rem)]
				text-b5 font-light text-right tracking-widest whitespace-nowrap leading-6
			">
				A 42 TRANSCENDENCE PROJECT
			</span>
		</button>
	);
}