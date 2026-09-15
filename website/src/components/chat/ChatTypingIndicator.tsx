import { useProfileStore } from "../../store/ProfileStore";
import { useTypingStore } from "../../store/TypingStore";

export const ChatTypingIndicator = () => {
	const typingUsers = useTypingStore((state) => state.typingUsers);
	const getCachedData = useProfileStore((state) => state.getCachedData);

	const users = Object.entries(typingUsers)
		.filter(([_, isTyping]) => isTyping)
		.map(([uuid]) => uuid);

	return (
		<div className="text-n6">
			{
				users.length === 1 ? users.map((uuid) => {
					const data = getCachedData(uuid);
					return (<p>{data?.name ?? "A player"} is typing...</p>);
				}) :
				users.length >= 2  ? <p>{users.length} players are typing...</p> :
				<></>
			}
		</div>
	);
};