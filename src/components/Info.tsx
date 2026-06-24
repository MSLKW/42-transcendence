import { useSceneStore } from "../store/useSceneStore";
import { useDevStore } from "../store/useDevStore";
import { InfoIcon } from "../icons/InfoIcon";
import { CloseIcon } from "../icons/CloseIcon";

interface InfoProps {
	call?: () => void;
	dismiss?: () => void;
}

export const InfoButton = ({ call }: InfoProps) => {
	return (
		<button
			className="btn-icon" 
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
	const showFrame = useDevStore((state) => state.showFrame);
	
    return (
		<div style={{ width: contAreaWidth, height: contAreaHeight }}
			className={`
				absolute z-1 inset-0 left-0
				w-full h-full
				border-a4 ${showFrame ? "border" : ""}
				flex place-content-center place-items-center
				text-white
		`}>
			<button className='btn-lightbox' onClick={dismiss}/>
			<div className="
				z-0
				w-[calc(100%-129px)] h-[calc(100%-131px)]
				border border-n2 rounded-3xl
				overflow-scroll
				relative
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
			<button data-tip="Close"
				className="btn-icon
					absolute z-1 top-0 right-0 -translate-x-9.75 translate-y-10.25"
				onClick={dismiss}>
					<CloseIcon />
			</button>
		</div>
	);
}