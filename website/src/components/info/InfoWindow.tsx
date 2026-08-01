import { Window } from "../window/Window";
import { AboutModule } from "./About/AboutModule";
import { TechModule } from "./Tech/TechModule";
import { TeamModule } from "./Team/TeamModule";

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
					<AboutModule />
					<hr />
					<TechModule />
					<hr />
					<TeamModule />
				</div>
			</div>
		</Window>
	);
}