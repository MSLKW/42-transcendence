import { create } from "zustand";

interface NotificationValues {
	id: number
	message: string;
	isError: boolean;
	isTimed: boolean;
	onAccept?: () => void;
	onIgnore?: () => void;
}

interface NotificationState extends NotificationValues {
	setNotification: (
		msg: string,
		error: boolean,
		timed: boolean,
		onAccept?: () => void,
		onIgnore?: () => void,
	) => void;
}

export const useNotificationStore = create<NotificationState>()(
	(set) => ({
		id: 0,
		message: "Welcome to Big 2!",
		isError: false,
		isTimed: true,
		onAccept: undefined,
		onIgnore: undefined,

		setNotification: (msg, error, timed, onAccept, onIgnore) => set((notificationStore) => ({
			id: notificationStore.id + 1,
			message: msg,
			isError: error,
			isTimed: timed,
			onAccept,
			onIgnore,
		})),
	}),
);