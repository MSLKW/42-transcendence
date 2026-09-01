import { motion, AnimatePresence } from "motion/react";
import { useBubbleStore, EMPTY_BUBBLES } from "../../store/BubbleStore";
import { useSceneStore } from "../../store/SceneStore";

interface ChatBubbleProps {
	uuid: string;
}

export const ChatBubbles = ({ uuid }: ChatBubbleProps) => {
	const bubbles = useBubbleStore((state) => state.bubbles[uuid] ?? EMPTY_BUBBLES);
	const removeBubble = useBubbleStore((state) => state.removeBubble);
	const setShowWindow = useSceneStore((state) => state.setShowWindow);
	// if (!bubbles.length)
	// 	return null;

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
						className="w-full"
					>
						<button
							onClick={() => {
								removeBubble(uuid, b.id);
								setShowWindow("chat", true);
							}}
							className="
								max-w-48
								px-3 py-2
								bg-b5/40 border border-b4 rounded-md
								text-n6 text-left text-1rem wrap-break-word
								hover:scale-105 active:scale-100 transition
								cursor-pointer pointer-events-auto
							"
						>
							{b.message}
						</button>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}