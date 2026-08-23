import { useRef, useEffect } from "react";
import { Window } from "../window/Window";
import { SendButton } from "./send/SendButton";
import { ChatBubble } from "./ChatBubble"
import { ChatReport } from "./ChatReport"

export const ChatWindow = () => {
	const focusRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (focusRef.current)
			focusRef.current.focus();
	}, []);

	return (
		<Window
			title="Chat"
			dismissKey="chat"
			placement="br"
			pinState={false}
		>
			<div
				className="
					w-[clamp(12.5rem,65vw+1rem,30rem)] h-[clamp(20rem,50vh+1rem,30rem)]
					p-[clamp(0.25rem,5vw+0.125rem,1rem)]
					flex flex-col place-content-start place-items-center
					gap-5		
					pointer-events-auto
				"
			>
				<div
					tabIndex={-1}
					className="
						w-full h-[calc(100%-50px)]
						overflow-scroll
						pointer-events-auto
					"
				>
					<div
						className="
							w-full h-fit
							text-n6
							p-7.5
							flex flex-col gap-5
						"
					>
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
					<input
						ref={focusRef}
						placeholder="Message"
						className="input-chat"
					/>
					<SendButton />
				</div>
			</div>
		</Window>
	);
}