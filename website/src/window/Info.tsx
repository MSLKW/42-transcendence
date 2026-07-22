import { CloseModule } from "../modules/Close";
import { LightboxButton } from "../components/button/Lightbox";

const AboutThisProject = () => {
	return (
		<div className="space-y-5 text-center">
			<h1>About This Project</h1>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>
	);
}

const TechnologiesUsed = () => {
	return (
		<div className="space-y-5 text-center">
			<h1>Technologies Used</h1>
			<div className="grid grid-cols-[1fr_1fr_1fr_1fr] grid-rows-auto gap-5">
				<div className="flex flex-col">
					<image className="h-30 aspect-square bg-a5" />
					<h2>TypeScript</h2>
				</div>
				<div className="flex flex-col">
					<image className="h-30 aspect-square bg-a5" />
					<h2>React Three Fiber</h2>
				</div>
				<div className="flex flex-col">
					<image className="h-30 aspect-square bg-a5" />
					<h2>Three.js</h2>
				</div>
				<div className="flex flex-col">
					<image className="h-30 aspect-square bg-a5" />
					<h2>NGINX</h2>
				</div>
				<div className="flex flex-col">
					<image className="h-30 aspect-square bg-a5" />
					<h2>PostgresSQL</h2>
				</div>
				<div className="flex flex-col">
					<image className="h-30 aspect-square bg-a5" />
					<h2>Drizzle</h2>
				</div>
				<div className="flex flex-col">
					<image className="h-30 aspect-square bg-a5" />
					<h2>Tailwind</h2>
				</div>
				<div className="flex flex-col">
					<image className="h-30 aspect-square bg-a5" />
					<h2>Zustand</h2>
				</div>
			</div>
		</div>
	);
}

const MeetTheTeam = () => {
	return (
		<div className="space-y-5">
			<h1 className="text-center">Meet The Team</h1>
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
		<section className="
			absolute z-1 top-0 left-0
			h-full w-full
			flex place-content-center place-items-center
		">
			<LightboxButton dismiss="info" blur={true} />
			<div className="
				z-0
				flex place-content-center place-items-center
				pointer-events-none
				max-w-[80%] max-h-[80%]
				relative
			">
				<CloseModule dismiss="info" />
				<div
					tabIndex={-1}
					className="
						h-200
						bg-n1
						border border-n2 rounded-3xl
						p-10 space-y-10
						text-n6
						overflow-scroll
						pointer-events-auto
				">
					<AboutThisProject />
					<hr />
					<TechnologiesUsed />
					<hr />
					<MeetTheTeam />
				</div>
			</div>
		</section>
	);
}