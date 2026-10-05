import { useNotificationStore } from "../../../store/NotificationStore";
import { NotifShowAllIcon } from "./NotifShowAllIcon";
import { NotifFilteredIcon } from "./NotifFilteredIcon";

export const NotifToggleButton = () => {
	const isNotifFiltered = useNotificationStore((store) => store.isNotifFiltered);
	const notifications = useNotificationStore((store) => store.notifications);

	return (
		<button
			data-tip={isNotifFiltered ? "Invite notifications hidden" : "All notifications shown"}
			onClick={() => useNotificationStore.setState({ isNotifFiltered: !isNotifFiltered })}
			className="btn-icon data-tip-down"
		>
			{ isNotifFiltered
				? <NotifFilteredIcon />
				: <NotifShowAllIcon />
			}
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
