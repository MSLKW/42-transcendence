import { useState, useRef, useEffect } from "react";
import { chatSocket } from "../../api/chat/chatSocket";
import { useChatStore } from "../../store/ChatStore";
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";
import { Window } from "../window/Window";
import { SendButton } from "./send/SendButton";
import { ChatBubble } from "./ChatBubble";
import { ChatReport } from "./ChatReport";

export const ChatWindow = () => {
	const { cachedChat, addToCachedChat } = useChatStore();
	const { hostUuid } = usePartyStore();
	const { clientUuid, getCachedData } = useProfileStore();
	const [ message, setMessage ] = useState("");
	const focusRef = useRef<HTMLInputElement | null>(null);
	const messagesEndRef = useRef<HTMLLIElement | null>(null);

	//socket lifecycle / listeners
	useEffect(() => {
		const unsubMessage = chatSocket.onMessage((chat) => {
			const data = getCachedData(chat.senderUuid);
			addToCachedChat(
				"MESSAGE",
				chat.senderUuid,
				data?.name ?? "Player",
				data?.avatar ?? "avatar-unknown.webp",
				chat.message
			);
			console.log(`[unsubMessage] uuid:${chat.senderUuid} message:${chat.message} timestamp:${chat.timestamp}`);
		});

		const unsubJoined = chatSocket.onUserJoined((notif) => {
			const data = getCachedData(notif.senderUuid);
			const name = data?.name ?? "A player";
			addToCachedChat(
				"NOTIFICATION",
				notif.senderUuid,
				name,
				"",
				`${name} has joined your party!`
			);
			console.log(`[unsubJoined] uuid:${notif.senderUuid} timestamp:${notif.timestamp}`);
		});

		const unsubLeft = chatSocket.onUserLeft((notif) => {
			const data = getCachedData(notif.senderUuid);
			const name = data?.name ?? "A player";
			addToCachedChat(
				"NOTIFICATION",
				notif.senderUuid,
				name,
				"",
				`${name} has left your party!`
			);
			console.log(`[unsubLeft] uuid:${notif.senderUuid} timestamp:${notif.timestamp}`);
		})

		return () => {
			unsubMessage();
			unsubJoined();
			unsubLeft();
		};
	}, []);

	//party/room changes
	useEffect(() => {
		if (hostUuid)
			chatSocket.joinRoom(hostUuid);
		else if (clientUuid)
			chatSocket.joinRoom(clientUuid);
	}, [hostUuid, clientUuid]);

	//focus
	useEffect(() => {
		focusRef.current?.focus();
	}, []);

	//scroll
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth"
		});
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
										? <ChatBubble data={data}/>
										: <ChatReport data={data}/>
									}
								</li>
							))}
							<li ref={messagesEndRef} />
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