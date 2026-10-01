import { useState, useRef, useEffect } from "react";
import { chatSocket } from "../../api/chat/chatSocket";
import { useChatStore } from "../../store/ChatStore";
import { usePartyStore } from "../../store/PartyStore";
import { useTypingStore } from "../../store/TypingStore";
import { Window } from "../window/Window";
import { SendButton } from "./send/SendButton";
import { ChatMessage } from "./ChatMessage";
import { ChatReport } from "./ChatReport";
import { ChatTypingIndicator } from "./ChatTypingIndicator";
import { ChatRateLimit } from "./ChatRateLimit";

export const ChatWindow = () => {
	const cachedChat = useChatStore((store) => store.cachedChat);
	const rateLimited = useChatStore((store) => store.rateLimited);
	const members = usePartyStore((store) => store.members);
	const typingUsers = useTypingStore((store) => store.typingUsers);

	const [message, setMessage] = useState("");

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

	const wasTyping = useRef(false);
	useEffect(() => {
		return () => {
			if (wasTyping.current)
				chatSocket.sendTyping(false);
		};
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setMessage(value);

		const isTyping = value.trim().length > 0;
		if (isTyping !== wasTyping.current) {
			wasTyping.current = isTyping;
			chatSocket.sendTyping(isTyping);
		}
	};

	const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		chatSocket.sendChat("MESSAGE", message);
		setMessage("");
		focusRef.current?.focus();

		if (wasTyping.current) {
			wasTyping.current = false;
			chatSocket.sendTyping(false);
		}
	};

	return (
		<Window
			title="Chat"
			dismissKey="chat"
			placement="br"
			hasPinButton={false}
			pinState={false}
			hasClearChatButton={true}
		>
			<div className="
				w-100 max-h-75
				flex flex-col place-content-start place-items-center
				pt-1rem px-1rem gap-0.5rem
				pointer-events-auto
			">
				<div
					ref={scrollContainerRef}
					tabIndex={-1}
					className="
						w-full h-full
						bg-dark rounded-md
						py-1rem px-1rem
						overflow-y-auto
						flex flex-col place-content-center place-items-center
						gap-1rem
				">
					{!cachedChat.length
						?
							<h2 className="text-n6/50">Chat messages appear here</h2>
						:
							<ul
								className="
									w-full
									flex flex-col
									text-n6
								"
							>
								{cachedChat.map((data, index) => {
									const isFirstFromClient = index === 0 || cachedChat[index - 1].uuid !== data.uuid;
									const nextMessage = cachedChat[index + 1];
									const isLastFromClient = nextMessage && nextMessage?.uuid !== data.uuid;

									return (
										<li key={`${data.uuid}-${index}`}>
											{data.type === "REPORT"
												?
													<ChatReport data={data}/>
												:
													<ChatMessage
														data={data}
														isFirstFromClient={isFirstFromClient}
														isLastFromClient={isLastFromClient}
													/>
											}
										</li>
									);
								})}
							</ul>
					}
				</div>
				<form
					onSubmit={handleSend}
					className="
					w-full
					flex place-content-between place-items-center
					gap-1rem
				">
					<input
						ref={focusRef}
						disabled={rateLimited ? true : false}
						type="text"
						placeholder="Message"
						value={message}
						onChange={handleChange}
						className="input-chat"
					/>
					<SendButton message={message}/>
				</form>
			</div>
			<div className="
				w-full h-2rem
				flex place-content-center place-items-center
				text-n6 opacity-60
			">
				{ 
					rateLimited ? <ChatRateLimit /> :
					Object.keys(typingUsers).length ? <ChatTypingIndicator /> :
					<p>{members.length === 1 ? "1 player" : members.length + " players"} in chat</p>
				}
			</div>
		</Window>
	);
}