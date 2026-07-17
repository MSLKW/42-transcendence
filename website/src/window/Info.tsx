import { useSceneStore } from "../store/SceneStore";
import { CloseButton } from "../components/button/Close";
import { LightboxButton } from "../components/button/Lightbox";

export const InfoWindow = () => {
	const { contAreaHeight, contAreaWidth, setShowWindow } = useSceneStore();

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
					<div className="
						absolute top-0 right-0 -translate-y-1/2 translate-x-1/2
						z-1
						w-12.5 h-12.5
					">
						<CloseButton dismiss={() => setShowWindow("info", false)}/>
					</div>
				</div>
			</div>
		</section>
	);
}