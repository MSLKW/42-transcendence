import { chatSocket } from "../../../api/chat/chatSocket";
import { useChatStore } from "../../../store/ChatStore";

interface EmoteOptionsProps {
	emoji: string;
	tip: string;
}

export const EmoteOptions = ({ emoji, tip }: EmoteOptionsProps) => {
	const rateLimited = useChatStore((store) => store.rateLimited);

	const handleSend = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.currentTarget.blur();
		chatSocket.sendChat("EMOTE", emoji);
	}

	return (
		<button
			key={emoji}
			data-tip={tip}
			disabled={rateLimited ? true : false}
			onClick={handleSend}
			className="
				text-3rem rounded-full
				h-12 aspect-square
				flex place-content-center place-items-center
				hover:outline outline-b5
				data-tip-down
		">
			{emoji}
		</button>
	);
}