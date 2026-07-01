import { useSceneStore } from "../store/useSceneStore";
import { ChatIcon } from "../icons/ChatIcon";
import { PinButton } from "./PinButton";
import { SendButton } from "../components/SendButton";
import { AvatarImage } from "./Avatar";

interface ChatProps {
	call?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	dismiss?: () => void;
	senderId?: number;
	senderName?: string;
	message?: string;
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

export const ChatBubble = ({ senderId, senderName, message }: ChatProps) => {
	return (
		<>
			{senderId === 0 ? (
				<div className="flex place-content-end place-items-start gap-5">
					<div className="flex flex-col gap-1 text-right bg-a3 border border-a4 rounded-xl px-5 py-3">
						<p className="text-b5 font-bold">{senderName}</p>
						<p>{message}</p>
					</div>
					<AvatarImage />
				</div>
			) : (
				<div className="flex place-content-start place-items-start gap-5">
					<AvatarImage />
					<div className="flex flex-col gap-1 text-left bg-a3 border border-a4 rounded-xl px-5 py-3">
						<p className="text-b5 font-bold">{senderName}</p>
						<p>{message}</p>
					</div>
				</div>
			)}
		</>
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
								w-full h-fit
								text-n6
								p-7.5
								flex flex-col gap-5
							">
								<ChatBubble senderId={0} senderName="Azrul" message="Sup Max!"/>
								<ChatBubble senderId={1} senderName="Max" message="Hey. How's the website coming along?"/>
								<ChatBubble senderId={0} senderName="Azrul" message="It's coming along great! Just need to finish up the last few details"/>
								<ChatBubble senderId={2} senderName="Jeremy" message="Yo check out the cpu bots i just made... ~Beep boop~"/>
								<ChatBubble senderId={3} senderName="Aisyah" message="Guys... I'm done with my Inception!"/>
								<ChatBubble senderId={3} senderName="Aisyah" message="Also soooo excited for this SQL talk!!!"/>
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