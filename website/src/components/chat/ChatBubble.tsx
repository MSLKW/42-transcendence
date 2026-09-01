import { useBubbleStore, EMPTY_BUBBLES } from "../../store/BubbleStore";
import { useSceneStore } from "../../store/SceneStore";

interface ChatBubbleProps {
	uuid: string;
}

export const ChatBubbles = ({ uuid }: ChatBubbleProps) => {
	const bubbles = useBubbleStore((state) => state.bubbles[uuid] ?? EMPTY_BUBBLES);
	const removeBubble = useBubbleStore((state) => state.removeBubble);
	const setShowWindow = useSceneStore((state) => state.setShowWindow);
	if (!bubbles.length)
		return null;

	return (
		<div
			className="
				absolute z-20
				bottom-full left-1/2 -translate-x-1/2 mb-2
				w-max max-w-48
				flex flex-col-reverse
				place-items-center gap-2
				pointer-events-none
			"
		>
			{bubbles.map((b) => (
				<button
					key={b.id}
					onClick={() => {
						removeBubble(uuid, b.id);
						setShowWindow("chat", true);
					}}
					className="
						max-w-48
						px-3 py-2
						bg-dark rounded-full
						text-n6 text-left text-1rem wrap-break-word
						hover:scale-105 active:scale-100 transition
						cursor-pointer pointer-events-auto
					"
				>
					{b.message}
				</button>
			))}
		</div>
	);
}