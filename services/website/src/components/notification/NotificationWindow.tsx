import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { NOTIFICATION_TYPE, useNotificationStore } from "../../store/NotificationStore";
import { useScrollToTop } from "../../utilities/react/useScrollToTop";
import { SingleNotification } from "./SingleNotification";

export const NotificationWindow = () => {
	const notifications = useNotificationStore((store) => store.notifications);
	const isNotifFiltered = useNotificationStore((store) => store.isNotifFiltered);

	const visibleNotification = notifications.filter(
		(item) => !isNotifFiltered || item.type !== NOTIFICATION_TYPE.invite
	);

	if (notifications.length === 0)
		return null;
	useScrollToTop();

	return createPortal(
		<div className="
			absolute z-5 top-11 left-1/2
			w-[50%] min-w-xs max-w-md
			flex flex-col items-center gap-0.5rem
			pointer-events-none
		">
			<AnimatePresence initial={false}>
				{ visibleNotification.map((item) => (
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