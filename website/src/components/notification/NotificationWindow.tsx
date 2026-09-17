import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useNotificationStore } from "../../store/NotificationStore";
import { useScrollToTop } from "../../utilities/useScrollToTop";
import { SingleNotification } from "./SingleNotification";

export const NotificationWindow = () => {
	const notifications = useNotificationStore((store) => store.notifications);

	if (notifications.length === 0)
		return null;
	useScrollToTop();

	return createPortal(
		<div
			className="
				absolute z-5 top-11 left-1/2
				w-[50%] min-w-xs max-w-md
				flex flex-col items-center gap-0.5rem
				pointer-events-none
			"
		>
			<AnimatePresence initial={false}>
				{ notifications.map((item) => (
					<motion.div
						key={item.id}
						layout
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
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
						<SingleNotification key={item.id} notification={item} />
					</motion.div>
				))}
			</AnimatePresence>
		</div>,
		document.body
	);
};