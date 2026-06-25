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
			className="btn-icon bg-n1 border border-n2"
			data-tip="Info"
			onClick={call}
		>
			<InfoIcon />
		</button>
	)
}

export const InfoLightbox = ({ dismiss }: InfoProps) => {
	const contAreaWidth = useSceneStore((scene) => scene.contAreaWidth);
	const contAreaHeight = useSceneStore((scene) => scene.contAreaHeight);

    return (
		<section style={{ width: contAreaWidth, height: contAreaHeight }}
			className="
				absolute z-1 inset-0 left-0
				w-full h-full
				flex place-content-center place-items-center
				"
		>
			<button tabIndex={-1} className='btn-lightbox' onClick={dismiss}/>
			<div className="
				z-0
				w-[calc(100%-130px)] h-[calc(100%-130px)]
				"
			>
				<div
					tabIndex={-1}
					className="
						border border-n2 rounded-3xl
						w-full h-full
						overflow-scroll
						"
				>
					<div 
						className="
							w-full h-[2000px]
							bg-linear-to-b from-a2 to-b2 
							p-10
							text-n6
							flex flex-col justify-between
							"
					>
						<p>Start of info section</p>
						<p>End of info section</p>
					</div>
				</div>
			</div>
			<CloseButton dismiss={dismiss}/>
		</section>
	);
}