import { useSceneStore } from "../store/useSceneStore";
import { ChatIcon } from "../icons/ChatIcon";
import { PinButton } from "./PinButton";

interface ChatProps {
	call?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	dismiss?: () => void;
}

export const ChatButton = ({ call }: ChatProps) => {
	return (
		<button data-tip="Chat"
			onClick={call}
			className="btn-icon btn-icon-border btn-tip-up"
		>
			<ChatIcon />
		</button>
	);
}

export const ChatLightbox = ({ dismiss }: ChatProps) => {
	const contAreaWidth = useSceneStore((scene) => scene.contAreaWidth);
	const contAreaHeight = useSceneStore((scene) => scene.contAreaHeight);

	const handleSend = (e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e)
			e.currentTarget.blur();
	}

	return (
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
		">
			<button tabIndex={-1} className='btn-lightbox-no-blur' onClick={dismiss}/>
			<div style={{ width: contAreaWidth, height: contAreaHeight }}
				className="
					z-0
					flex place-content-end place-items-end pr-12.5 pb-13.5
					w-full h-full
					mx-auto
					pointer-events-none
			">
				<div className="
					w-[clamp(12.5rem,65vw+1rem,30rem)] h-[clamp(20rem,50vh+1rem,30rem)]
					relative
				">
					<div tabIndex={-1}
						className="
							border border-n2 rounded-[clamp(0px,2vh,24px)]
							w-full h-[calc(100%-50px)]
							overflow-scroll
							pointer-events-auto
							mb-2
					">
						<div className="
							w-full h-[2000px]
							bg-n1
							p-10
							text-n6
							flex flex-col justify-between
						">
							<p>Start of chat section</p>
							<p>End of chat section</p>
						</div>
					</div>
					<div className="w-full h-12.5 relative">
						<input className="input-chat"/>
						<button className="btn-send" onClick={(e) => {handleSend(e)}}>
								SEND
						</button>
					</div>
					<div className="
						absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2
						z-1
						w-12.5 h-12.5
					">
						<PinButton/>
					</div>
				</div>
			</div>
		</section>
	);
}