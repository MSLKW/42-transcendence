import { motion, AnimatePresence } from "motion/react";
import { useBubbleStore, EMPTY_BUBBLES } from "../../store/BubbleStore";
import { useProfileStore } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { EmoteBubble } from "./EmoteBubble";

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

interface ChatBubbleProps {
	uuid: string;
}

export const ChatBubbles = ({ uuid }: ChatBubbleProps) => {
	const bubbles = useBubbleStore((state) => state.bubbles[uuid] ?? EMPTY_BUBBLES);
	const { clientUuid } = useProfileStore();
	const { currentScene } = useSceneStore();

	return (
		<div
			className={`
				absolute z-20
				${ (currentScene !== "Game" || clientUuid === uuid) ? "bottom-full mb-5" : "top-full mt-5" }
				left-1/2 -translate-x-1/2
				flex flex-col-reverse
				w-max max-w-48
				place-items-center gap-2
				pointer-events-none
			`}
		>
			<AnimatePresence initial={false}>
				{ bubbles.map((b) => (
					<motion.div
						key={b.id}
						layout
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{
							layout: {
								duration: 0.3,
								ease: "easeInOut",
							},
							opacity: {
								duration: 0.2,
							},
							y: {
								duration: 0.3,
								ease: "easeInOut",
							},
						}}
						className="w-fit"
					>
						{ b.type === "MESSAGE"
							? <MessageBubble message={b.message} uuid={uuid} id={b.id}/>
							: <EmoteBubble message={b.message} uuid={uuid} id={b.id}/>
						}
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}