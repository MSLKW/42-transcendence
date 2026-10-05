import { useProfileStore } from "../../store/ProfileStore";
import { useTypingStore } from "../../store/TypingStore";

export const ChatTypingIndicator = () => {
	const typingUsers = useTypingStore((store) => store.typingUsers);
	const cachedData = useProfileStore((store) => store.cachedData);

	const users = Object.entries(typingUsers)
		.filter(([_, isTyping]) => isTyping)
		.map(([uuid]) => uuid);

	return (
		<div className="text-n6">
			{
				users.length === 1 ? users.map((uuid) => {
					return (<p key="chat-typing-indicator">{cachedData[uuid ?? ""]?.name ?? "A player"} is typing...</p>);
				}) :
				users.length >= 2  ? <p key="chat-typing-indicator">{users.length} players are typing...</p> :
				<></>
			}
		</div>
	);
};