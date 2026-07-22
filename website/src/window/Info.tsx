import { useSceneStore } from "../store/SceneStore";
import { CloseModule } from "../modules/Close";
import { LightboxButton } from "../components/button/Lightbox";

export const InfoWindow = () => {
	const { sceneHeight, sceneWidth } = useSceneStore();

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
				relative
			">
				<CloseModule dismiss="info" />
				<div
					tabIndex={-1}
					className="
						bg-n1
						border border-n2 rounded-3xl
						p-10 space-y-10
						text-n6
						overflow-scroll
						pointer-events-auto
						text-center
				">
					<div className="space-y-5">
						<h1>About This Project</h1>
						<p>Paragraph about Big2 and Transcendence requirements</p>
					</div>
					<hr />
					<div className="space-y-5">
						<h1>Technologies Used</h1>
						<p>Paragraph about Big2 and Transcendence requirements</p>
					</div>
					<hr />
					<div className="space-y-5">
						<h1>Meet The Team</h1>
						<div className="flex gap-5">
							<div className="flex flex-col">
								<image className="h-50 w-50 bg-a5" />
								<h2>Max</h2>
							</div>
							<div className="flex flex-col">
								<image className="h-50 w-50 bg-a5" />
								<h2>Azrul</h2>
							</div>
							<div className="flex flex-col">
								<image className="h-50 w-50 bg-a5" />
								<h2>Jeremy</h2>
							</div>
							<div className="flex flex-col">
								<image className="h-50 w-50 bg-a5" />
								<h2>Aisyah</h2>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}