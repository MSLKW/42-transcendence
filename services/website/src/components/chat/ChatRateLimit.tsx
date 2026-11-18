import { useChatStore } from "../../store/ChatStore";

export const ChatRateLimit = () => {
	const isChatRateLimited = useChatStore((store) => store.isChatRateLimited);
	
	return (
		<>
			{isChatRateLimited &&
				<p className="text-n6">
					Rate limited - too many messages sent
				</p>
			}
		</>
	);
}