export const BigLogo = () => {
	return (
		// p-[7.5rem]
		<div className='
			w-full h-full
			flex flex-col place-content-end place-items-center
			gap-[clamp(2.5rem,10vh+1.25rem,7.5rem)]
			p-[clamp(2rem,7.5vh+0.125rem,7.5rem)]
		'>
			<div className='
				flex gap-[clamp(1.25rem,4vw+0.625rem,2.5rem)]
				leading-0
				pointer-events-auto
			'>
				<h2 className="
					flex
					gap-[clamp(1.25rem,4vw+0.625rem,2.5rem)]
				">
					<span>B</span><span>I</span><span>G</span>
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