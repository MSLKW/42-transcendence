import { useNotificationStore } from "../../../store/NotificationStore";
import { NotifShowAllIcon } from "./NotifShowAllIcon";
import { NotifFilteredIcon } from "./NotifFilteredIcon";
import { Tooltip } from "../../../utilities/react/Tooltip";

export const NotifToggleButton = () => {
	const isNotifFiltered = useNotificationStore((store) => store.isNotifFiltered);
	const notifications = useNotificationStore((store) => store.notifications);

	return (
		<button
			onClick={() => useNotificationStore.setState({ isNotifFiltered: !isNotifFiltered })}
			className="btn-icon relative"
		>
			<Tooltip
				text={isNotifFiltered ? "All notifications shown" : "Invite notifications hidden"}
				position="bottom"
			>
				{ isNotifFiltered
					? <NotifShowAllIcon />
					: <NotifFilteredIcon />
				}
			</Tooltip>
			<div className="
				absolute top-0 right-0 -translate-y-1/4 translate-x-1/4
				bg-dark rounded-full
				text-n6 h-2rem aspect-square
				flex place-content-center place-items-center
			">
				<p>{notifications.length}</p>
			</div>
		</button>
	);
}
