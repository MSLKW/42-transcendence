import { useSceneStore } from "../store/SceneStore";
import { CloseModule } from "../modules/Close";
import { LightboxButton } from "../components/button/Lightbox";

export const InfoWindow = () => {
	const { contAreaHeight, contAreaWidth } = useSceneStore();

    return (
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
			flex place-content-center place-items-center
		">
			<LightboxButton dismiss="info" blur={true} />
			<div style={{ width: contAreaWidth, height: contAreaHeight }}
				className="
					z-0
					flex place-content-center place-items-center
					pointer-events-none
			">
				<div className="
					w-[80%] h-[80%]
					relative
				">
					<div tabIndex={-1}
						className="
							border border-n2 rounded-3xl
							w-full h-full
							overflow-scroll
							pointer-events-auto
					">
						<div className="
							w-full h-[2000px]
							bg-linear-to-b from-a2 to-b2 
							p-10
							text-n6
							flex flex-col justify-between
						">
							<p>Start of info section</p>
							<p>End of info section</p>
						</div>
					</div>
					<CloseModule dismiss="info" />
				</div>
			</div>
		</section>
	);
}