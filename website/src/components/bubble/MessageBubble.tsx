import { useBubbleStore } from "../../store/BubbleStore";

interface MessageBubbleProps {
	message: string;
	uuid: string;
	id: string;
}

export const MessageBubble = ({ message, uuid, id }: MessageBubbleProps) => {
	const removeBubble = useBubbleStore((state) => state.removeBubble);

	return (
		<button
			onClick={() => removeBubble(uuid, id)}
			className="
				max-w-48
				px-3 py-2
				bg-b5/40 border border-b4 rounded-md
				text-n6 text-center text-1rem wrap-anywhere
				hover:scale-105 active:scale-100 transition
				cursor-pointer pointer-events-auto
			"
		>
			{message}
		</button>
	);
}
