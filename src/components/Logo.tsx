export const BigLogo = () => {
	return (
		<div className="
			flex flex-col place-content-center place-items-center
		">
			<div className="
				gap-[clamp(0.5rem,2.308vh-0.192rem,1.25rem)]
				flex place-content-center place-items-center
			">
				<span className="
					text-[clamp(4rem,5.714vmin+2.857rem,8rem)]
					font-thin
					text-n6
					tracking-[clamp(2rem,4.286vmin+1.143rem,5rem)]
				">
					BIG
				</span>
				<span className="
					text-[clamp(8rem,11.429vmin+5.714rem,16rem)]
					font-extrabold
					text-n6
					leading-[clamp(7rem,15.385vmin+2.385rem,12rem)]
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
			absolute z-0 right-0
			w-max h-max
			flex flex-col place-content-center place-items-end
			gap-[0.25rem]
			pointer-events-none
		">
			<div className="
				flex place-content-center place-items-center
				leading-0
				gap-[clamp(0.375rem,1.154vmin+0.029rem,0.75rem)]
			">
				<span className="
					text-[clamp(1.5rem,4.615vmin+0.115rem,3rem)]
					tracking-[clamp(0.875rem,1.923vh+0.298rem,1.5rem)]
					font-thin text-n6
				">
					BIG
				</span>
				<span className="
					text-[clamp(2.5rem,7.692vmin+0.192rem,5rem)]
					leading-[clamp(2rem,6.154vmin+0.154rem,4rem)]
					font-extrabold text-n6
				">
					2
				</span>
			</div>
			<span className="
				text-[clamp(0.375rem,1.154vmin+0.029rem,0.75rem)]
				text-b5 font-extralight text-right whitespace-nowrap
			">
				A 42 TRANSCENDENCE PROJECT
			</span>
		</div>
	);
}