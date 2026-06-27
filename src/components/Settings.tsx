import { useSceneStore } from "../store/useSceneStore";
import { SettingsIcon } from "../icons/SettingsIcon";
import { CloseButton } from "./CloseButton";

interface SettingsProps {
	call?: () => void;
	dismiss?: () => void;
}

export const SettingsButton = ({ call }: SettingsProps) => {
	return (
		<button
			className="btn-icon btn-tip-down"
			data-tip="Settings"
			onClick={call}
		>
			<SettingsIcon />
		</button>
	)
}

export const SettingsLightbox = ({ dismiss }: SettingsProps) => {
	const contAreaWidth = useSceneStore((scene) => scene.contAreaWidth);
	const contAreaHeight = useSceneStore((scene) => scene.contAreaHeight);
	console.log("hi");
	return (
		<section style={{ width: contAreaWidth, height: contAreaHeight }}
			className="
				absolute z-1 top-0 left-0
				w-full h-full
				flex place-content-center place-items-center
		">
			<button tabIndex={-1} className='btn-lightbox' onClick={dismiss}/>
			<div className="
				z-0
				w-[clamp(80%,5vw,60%)] h-[clamp(80%,5vh,60%)]
				relative
			">
				<div tabIndex={-1}
					className="
						border border-n2 rounded-[clamp(0px,2vh,24px)]
						w-full h-full
						overflow-scroll
				">
					<div className="
						w-full h-[2000px]
						bg-linear-to-b from-a2 to-b2 
						p-10
						text-n6
						flex flex-col justify-between
					">
						<p>Start of settings section</p>
						<p>End of settings section</p>
					</div>
				</div>
				<div className="
					z-1
					absolute top-0 right-0 -translate-y-1/2 translate-x-1/2
					w-12.5 h-12.5
				">
					<CloseButton dismiss={dismiss}/>
				</div>
			</div>
		</section>
	);
}