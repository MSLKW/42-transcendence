import { Window } from "../window/Window";
import { AboutModule } from "./About/AboutModule";
import { TechModule } from "./Tech/TechModule";
import { TeamModule } from "./Team/TeamModule";
import { ShowDevSection } from "./Dev/ShowDevSection";

export const InfoWindow = () => {
    return (
		<Window
			title="Info"
			dismissKey="info"
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
						px-3rem
						divide-n2/40 divide-y-2
						overflow-scroll
				">
					<AboutModule />
					<TechModule />
					<TeamModule />
					<ShowDevSection />
				</div>
			</div>
		</Window>
	);
}