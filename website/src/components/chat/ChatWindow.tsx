import { useState, useRef, useEffect } from "react";
import { chatSocket } from "../../api/chat/chatSocket";
import { useChatStore } from "../../store/ChatStore";
import { Window } from "../window/Window";
import { SendButton } from "./send/SendButton";
import { ChatMessage } from "./ChatMessage";
import { ChatReport } from "./ChatReport";

export const ChatWindow = () => {
	const { cachedChat } = useChatStore();
	const [ message, setMessage ] = useState("");
	const focusRef = useRef<HTMLInputElement | null>(null);
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);

	//focus
	useEffect(() => {
		focusRef.current?.focus();
	}, []);

	//scroll
	useEffect(() => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTo({
				top: scrollContainerRef.current.scrollHeight,
				behavior: "smooth"
			});
		}
	}, [cachedChat.length]);

	const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		chatSocket.sendMessage(message);
		setMessage("");
		focusRef.current?.focus();
	};

	return (
		<Window
			title="Chat"
			dismissKey="chat"
			placement="br"
			pinState={false}
		>
			<div
				className="
					w-100 max-h-[75vh]
					flex flex-col place-content-start place-items-center
					py-1rem px-1rem gap-1rem
					pointer-events-auto
				"
			>
				<div
					ref={scrollContainerRef}
					tabIndex={-1}
					className="
						w-full h-full
						bg-dark rounded-xl
						py-1rem px-1rem
						overflow-y-auto
						flex place-content-center place-items-center
					"
				>
					{!cachedChat.length ?
						<h2 className="text-n6/50">Chat messages appear here</h2>
					:
					<ul className="space-y-2 text-n6 w-full">
						{cachedChat.map((data, index) => (
							<li key={`${data.uuid}-${index}`}>
								{data.type === "MESSAGE"
									? <ChatMessage data={data}/>
									: <ChatReport data={data}/>
								}
							</li>
						))}
					</ul>
					}
				</div>
				<form
					onSubmit={handleSend}
					className="
						w-full
						flex place-content-between place-items-center
						gap-3
					"
				>
					<input
						ref={focusRef}
						type="text"
						placeholder="Message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className="input-chat"
					/>
					<SendButton message={message}/>
				</form>
			</div>
		</Window>
	);
}