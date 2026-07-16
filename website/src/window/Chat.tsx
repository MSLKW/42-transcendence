import { useSceneStore } from "../store/SceneStore";
import { PinButton } from "../components/button/Pin";
import { SendButton } from "../components/button/Send";
import { ChatBubble } from "../components/label/ChatBubble"
import { ChatReport } from "../components/label/ChatReport"

export const ChatWindow = () => {
	const { contAreaHeight, contAreaWidth, setShowWindow } = useSceneStore();

	return (
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
		">
			<button tabIndex={-1} className='btn-lightbox-no-blur' onClick={() => setShowWindow("chat", false)}/>
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
						bg-linear-to-b from-n0 to-n1
						border border-n2 rounded-[clamp(0.25rem,5vh+0.125rem,2rem)]
						p-[clamp(0.25rem,5vw+0.125rem,1rem)]
						flex flex-col place-content-start place-items-center
						gap-5		
						pointer-events-auto
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
								<ChatReport message="1 person in chat" />
								<ChatReport message="Max has joined your party!" />
								<ChatBubble senderId={0} senderName="Azrul" message="Sup Max!"/>
								<ChatBubble senderId={1} senderName="Max" message="Hey. How's the website coming along?"/>
								<ChatBubble senderId={0} senderName="Azrul" message="It's coming along great! Just need to finish up the last few details"/>
								<ChatReport message="Jeremy has joined your party!" />
								<ChatBubble senderId={2} senderName="Jeremy" message="Yo check out the cpu bots i just made... ~Beep boop~"/>
								<ChatReport message="Aisyah has joined your party!" />
								<ChatBubble senderId={3} senderName="Aisyah" message="Guys... I'm done with my Inception!"/>
								<ChatBubble senderId={3} senderName="Aisyah" message="Also soooo excited for this SQL talk!!!"/>
								<ChatReport message="Max has left the party" />
								<ChatReport message="Jeremy has left the party" />
								<ChatReport message="Aisyah has left the party" />
							</div>
						</div>
						<hr className="w-full h-[0.3rem] text-n2"/>
						<div className="
							w-full h-max
							flex place-content-between place-items-center
							gap-3
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