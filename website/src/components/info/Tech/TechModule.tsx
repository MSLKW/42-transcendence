export const TechModule = () => {
	return (
		<div
			className="
				flex flex-col
				gap-2rem
				text-center
				py-3rem
			"
		>
			<h1 className="text-b5">Technologies Used</h1>
			<div className="grid grid-cols-[1fr_1fr_1fr_1fr] grid-rows-auto gap-5">
				<div className="flex flex-col">
					<image className="h-30 aspect-square bg-a5" />
					<h3>TypeScript</h3>
				</div>
				<div className="flex flex-col">
					<image className="h-30 aspect-square bg-a5" />
					<h3>React Three Fiber</h3>
				</div>
				<div className="flex flex-col">
					<image className="h-30 aspect-square bg-a5" />
					<h3>Three.js</h3>
				</div>
				<div className="flex flex-col">
					<image className="h-30 aspect-square bg-a5" />
					<h3>NGINX</h3>
				</div>
				<div className="flex flex-col">
					<image className="h-30 aspect-square bg-a5" />
					<h3>PostgresSQL</h3>
				</div>
				<div className="flex flex-col">
					<image className="h-30 aspect-square bg-a5" />
					<h3>Drizzle</h3>
				</div>
				<div className="flex flex-col">
					<image className="h-30 aspect-square bg-a5" />
					<h3>Tailwind</h3>
				</div>
				<div className="flex flex-col">
					<image className="h-30 aspect-square bg-a5" />
					<h3>Zustand</h3>
				</div>
			</div>
		</div>
	);
}