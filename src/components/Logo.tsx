export const BigLogo = () => {
	return (
		<div className="
			w-full h-full
			flex flex-col place-content-end place-items-center
			gap-[clamp(2.5rem,10vh+1.25rem,7.5rem)]
			p-[clamp(2rem,7.5vh+0.125rem,7.5rem)]
		">
			<div className="
				flex
				gap-[clamp(1.25rem,4vw+0.625rem,2.5rem)]
				leading-0
				pointer-events-auto
			">
				<h2 className="
					flex
					tracking-[clamp(1.25rem,5vw+0.625rem,5rem)]
				">
					BIG
				</h2>
				<h1>2</h1>
			</div>
			<h3 className="
				text-center
				text-b5
				pointer-events-auto
				whitespace-nowrap
			">
				A 42 TRANSCENDENCE PROJECT
			</h3>
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
		">
			<div className="
				flex
				leading-0
				pointer-events-auto
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
				pointer-events-auto
				whitespace-nowrap
			">
				A 42 TRANSCENDENCE PROJECT
			</h6>
		</div>
	);
}