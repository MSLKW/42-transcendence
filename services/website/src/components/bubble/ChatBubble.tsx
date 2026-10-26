import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "../../store/AuthStore";
import { useBubbleStore, EMPTY_BUBBLES } from "../../store/BubbleStore";
import { useSceneStore } from "../../store/SceneStore";
import { EmoteBubble } from "./EmoteBubble";
import { MessageBubble } from "./MessageBubble";

interface ChatBubbleProps {
	uuid: string;
}

export const ChatBubbles = ({ uuid }: ChatBubbleProps) => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const bubbles = useBubbleStore((store) => store.bubbles[uuid]) ?? EMPTY_BUBBLES;
	const currentScene = useSceneStore((store) => store.currentScene);

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