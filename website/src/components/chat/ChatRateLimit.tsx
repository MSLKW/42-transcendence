import { useChatStore } from "../../store/ChatStore";

export const ChatRateLimit = () => {
	const rateLimitMessage = useChatStore((store) => store.rateLimitMessage);
	
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