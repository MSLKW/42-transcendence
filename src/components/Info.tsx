import { useSceneStore } from "../store/useSceneStore";
import { InfoIcon } from "../icons/InfoIcon";
import { CloseButton } from "./CloseButton";

interface InfoProps {
	call?: () => void;
	dismiss?: () => void;
}

export const InfoButton = ({ call }: InfoProps) => {
	return (
		<button
			data-tip="Info"
			onClick={call}
			className="btn-icon btn-icon-border btn-tip-down"
		>
			<InfoIcon />
		</button>
	)
}

export const InfoLightbox = ({ dismiss }: InfoProps) => {
	const contAreaWidth = useSceneStore((scene) => scene.contAreaWidth);
	const contAreaHeight = useSceneStore((scene) => scene.contAreaHeight);

    return (
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
			flex place-content-center place-items-center
		">
			<button tabIndex={-1} className='btn-lightbox' onClick={dismiss}/>
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
						<CloseButton dismiss={dismiss}/>
					</div>
				</div>
			</div>
		</section>
	);
}