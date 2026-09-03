import { motion } from "framer-motion";
import { useBubbleStore } from "../../store/BubbleStore";

interface EmoteBubbleProps {
	message: string;
	uuid: string;
	id: string;
}

export const EmoteBubble = ({ message, uuid, id }: EmoteBubbleProps) => {
	const removeBubble = useBubbleStore((state) => state.removeBubble);

	return (
		<motion.button
			onClick={() => removeBubble(uuid, id)}
			animate={{
				scale: [1, 1.4, 1],
				rotate: [-10, 10, -10, 10, 0],
			}}
			transition={{
				duration: 1,
				ease: "easeInOut",
				repeat: Infinity,
				repeatDelay: 0.1,
			}}
			className="
				max-w-48
				text-center text-3rem
				hover:scale-105 active:scale-100 transition
				cursor-pointer pointer-events-auto
			"
		>
			{message}
		</motion.button>
	);
}