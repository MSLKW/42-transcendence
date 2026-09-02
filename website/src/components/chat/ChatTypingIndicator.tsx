import { useProfileStore } from "../../store/ProfileStore";
import { useTypingStore } from "../../store/TypingStore";

export const ChatTypingIndicator = () => {
	const typingUsers = useTypingStore((state) => state.typingUsers);
	const getCachedData = useProfileStore((state) => state.getCachedData);

	const users = Object.entries(typingUsers)
		.filter(([_, isTyping]) => isTyping)
		.map(([uuid]) => uuid);

	return (
		<>
			{users.map((uuid) => {
				const data = getCachedData(uuid);
				return (
					<div
						key={uuid}
						className="text-n6"
					>
						<p>{data?.name ?? "A player"} is typing...</p>
					</div>
				);
			})}
		</>
	);
};