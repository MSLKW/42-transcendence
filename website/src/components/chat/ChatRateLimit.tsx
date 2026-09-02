import { useChatStore } from "../../store/ChatStore";

export const ChatRateLimit = () => {
	const rateLimitMessage = useChatStore((state) => state.rateLimitMessage);
	
	return (
		<>
			{rateLimitMessage &&
				<p className="text-n6">
					{rateLimitMessage}
				</p>
			}
		</>
	);
}