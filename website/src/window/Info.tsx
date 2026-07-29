import { Window } from "./Window";

const AboutThisProject = () => {
	return (
		<div className="space-y-5 text-center">
			<h1 className="text-b5">About This Project</h1>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>
	);
}

const TechnologiesUsed = () => {
	return (
		<div className="space-y-5 text-center">
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

const MeetTheTeam = () => {
	return (
		<div className="space-y-5">
			<h1 className="text-center text-b5">Meet The Team</h1>
			<div className="flex gap-5">
				<image className="h-30 aspect-square bg-a5" />
				<div className="flex flex-col">
					<h2>Max - Game</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
				</div>
			</div>
			<div className="flex gap-5">
				<image className="h-30 aspect-square bg-a5" />
				<div className="flex flex-col">
					<h2>Azrul - Website</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
				</div>
			</div>
			<div className="flex gap-5">
				<image className="h-30 aspect-square bg-a5" />
				<div className="flex flex-col">
					<h2>Jeremy - Authentication / Party Manager / Bot</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
				</div>
			</div>
			<div className="flex gap-5">
				<image className="h-30 aspect-square bg-a5" />
				<div className="flex flex-col">
					<h2>Aisyah - Database</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
				</div>
			</div>
		</div>
	);
}

export const InfoWindow = () => {
    return (
		<Window
			title="Info"
			dismissKey="info"
			profileIndex={-1}
		>
			<div
				className="
					w-200 max-w-[80vw]
					flex place-content-center place-items-center
					pointer-events-auto
					relative
					text-n6
				"
			>
				<div
					className="
						h-200 max-h-[80vh]
						p-10 space-y-10
						overflow-scroll
				">
					<AboutThisProject />
					<hr />
					<TechnologiesUsed />
					<hr />
					<MeetTheTeam />
				</div>
			</div>
		</Window>
	);
}