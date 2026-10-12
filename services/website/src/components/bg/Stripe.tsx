export const StripeBg = () => {
	return (
		<section className="
			absolute z-[-1]
			top-0
			left-1/2 -translate-x-1/2
			h-screen w-screen
			pointer-events-none
		">
			<svg
				width="100vw" height="100vh"
				viewBox="0 0 100 100"
				preserveAspectRatio="xMidYMid slice"
			>
				<polygon
					points="50,0 100,0 50,100, 0,100"
					fill="var(--color-a1)"
					stroke="var(--color-a2)"
					strokeWidth="0.1"
				/>
			</svg>
		</section>
	);
}