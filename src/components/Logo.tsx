export const BigLogo = () => {
	return (
		<div className="
			flex flex-col place-content-center place-items-center
		">
			<div className="
				gap-[clamp(0.5rem,2.308vh-0.192rem,1.25rem)]
				flex
			">
				<span className="
					text-[clamp(4rem,5.714vw+2.857rem,8rem)]
					font-thin
					text-n6
					leading-[clamp(7.5rem,7.692vh+5.192rem,10rem)]
					tracking-[clamp(2rem,4.286vmin+1.143rem,5rem)]
				">
					BIG
				</span>
				<span className="
					text-[clamp(8rem,11.429vw+5.714rem,16rem)]
					font-extrabold
					text-n6
					leading-[clamp(7rem,7.692vh+4.692rem,9.5rem)]
				">
					2
				</span>
			</div>
			<span className="
				text-[clamp(1rem,0.714vw+0.857rem,1.5rem)]
				text-b5
				font-extralight
				tracking-widest
				whitespace-nowrap
			">
				A 42 TRANSCENDENCE PROJECT
			</span>
		</div>
	);
}

export const SmallLogo = () => {
	return (
		<div className="
			absolute
			z-0
			w-full h-full
			flex flex-col place-content-end place-items-end
			gap-[clamp(1.5rem,2vw+0.75rem,2rem)]
			pointer-events-none
		">
			<div className="
				flex
				leading-0
			">
				<h5 className="
					flex
					tracking-[1rem]
				">
					BIG
				</h5>
				<h4>2</h4>
			</div>
			<h6 className="
				text-right
				text-b5
				whitespace-nowrap
			">
				A 42 TRANSCENDENCE PROJECT
			</h6>
		</div>
	);
}