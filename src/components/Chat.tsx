import { useSceneStore } from "../store/useSceneStore";
import { ChatIcon } from "../icons/ChatIcon";
import { PinButton } from "./PinButton";
import { SendButton } from "../components/SendButton";

interface ChatProps {
	call?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	dismiss?: () => void;
}

export const ChatButton = ({ call }: ChatProps) => {
	return (
		<button
			data-tip="Chat"
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

	return (
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
		">
			<button tabIndex={-1} className='btn-lightbox-no-blur' onClick={dismiss}/>
			<div style={{ width: contAreaWidth, height: contAreaHeight }}
				className="
					z-0
					flex place-content-end place-items-end
					pb-[clamp(0.125rem,3.5vw+0.0625rem,3.125rem)] pr-[clamp(0.125rem,3.5vw+0.0625rem,3.125rem)]
					w-full h-full
					mx-auto
					pointer-events-none
			">
				<div className="
					w-[clamp(12.5rem,65vw+1rem,30rem)] h-[clamp(20rem,50vh+1rem,30rem)]
					flex flex-col place-content-between place-items-center
					gap-3
					relative
				">
					<div className="
						w-full h-full
						bg-n1
						border border-n2 rounded-[clamp(0.25rem,5vh+0.125rem,2rem)]
						p-[clamp(0.25rem,5vw+0.125rem,1rem)]
						flex flex-col place-content-start place-items-center
						gap-3
					">
						<div tabIndex={-1}
							className="
								w-full h-[calc(100%-50px)]
								overflow-scroll
								pointer-events-auto
						">
							<div className="
								w-full h-[2000px]
								text-n6
								p-7.5
								flex flex-col justify-between
							">
								<p>Start of chat section</p>
								<p>End of chat section</p>
							</div>
						</div>
						<hr className="w-full h-[0.3rem] text-n2"/>
						<div className="
							w-full h-max
							flex place-content-between place-items-center
							gap-3
							pointer-events-auto
						">
							<input className="input-chat"/>
							<SendButton />
						</div>
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