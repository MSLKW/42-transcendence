import { useChatStore } from "../../store/ChatStore";

export const ChatRateLimit = () => {
	const rateLimited = useChatStore((store) => store.rateLimited);
	
	return (
		<>
			{rateLimited &&
				<p className="text-n6">
					{rateLimited}
				</p>
			}
		</>
	);
}