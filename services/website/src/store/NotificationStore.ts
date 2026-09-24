import { create } from "zustand";
import { useSceneStore } from "./SceneStore";

<<<<<<< HEAD
export const NOTIFICATION_TYPE = {
	error: 0,
	message: 1,
	invite: 2,
} as const;

export interface NotificationItem {
	id: string;
	type: number;
=======
export const notificationType = {
	error: 0,
	nameInput: 1,
	invite: 2,
	botSelect: 3,
	nextRound: 4,
} as const;

interface NotificationValues {
	type: number;
	id: number;
>>>>>>> origin/int/KAN-36-website-db
	message: string;
	isError: boolean;
	isTimed: boolean;
	numOfButtons: number;
	isValid?: boolean;
	onButton1Click?: () => void;
	onButton2Click?: () => void;
}

<<<<<<< HEAD
interface NotificationValues {
	notifications: NotificationItem[];
}

interface NotificationState extends NotificationValues {
	showNotification: (msg: string, type: number, btn1?: () => void, btn2?: () => void) => void;
	removeNotification: (id: string) => void;
	setIsValid: (id: string, valid: boolean) => void;
=======
interface NotificationState extends NotificationValues {
	setNotification: (
		msg: string,
		type: number,
		btn1?: () => void,
		btn2?: () => void,
	) => void;
	setIsValid: (valid: boolean) => void;
>>>>>>> origin/int/KAN-36-website-db
}

export const useNotificationStore = create<NotificationState>()(
	(set) => ({
<<<<<<< HEAD
		notifications: [],

		showNotification: (msg, type, btn1, btn2) => {
			let isError = false;
			let isTimed = false;
			let numOfButtons = 0;

			if (type === NOTIFICATION_TYPE.error) {
				isError = true;
				isTimed = true;
				numOfButtons = 0;
			} else if (type === NOTIFICATION_TYPE.message) {
				isError = false;
				isTimed = true;
				numOfButtons = 0;
			} else if (type === NOTIFICATION_TYPE.invite) {
				isError = false;
				isTimed = false;
				numOfButtons = 2;
			}

			const newNotification: NotificationItem = {
				id: crypto.randomUUID(),
				type: type,
				message: msg,
				isError: isError,
				isTimed: isTimed,
				numOfButtons: numOfButtons,
				onButton1Click: btn1,
				onButton2Click: btn2,
			};

			set((state) => ({
				notifications: [...state.notifications, newNotification],
			}));

			useSceneStore.getState().setShowWindow("notification", true);
		},
		
		removeNotification: (id) => {
			set((state) => {
				const updated = state.notifications.filter((n) => n.id !== id);
				if (updated.length === 0)
					useSceneStore.getState().setShowWindow("notification", false);
				return { notifications: updated };
			});
		},

		setIsValid: (id, valid) => set((state) => ({
			notifications: state.notifications.map((n) => n.id === id
				? { ...n, isValid: valid }
				: n
			),
		})),
=======
		type: notificationType.error,
		id: 0,
		message: "Welcome to Big 2!",
		isError: false,
		isTimed: true,
		numOfButtons: 0,
		onButton1Click: undefined,
		onButton2Click: undefined,

		setNotification: (msg, type, btn1, btn2) => {
			set((notificationStore) => {
				let isError = false;
				let isTimed = false;
				let numOfButtons = 0;

				if (type === notificationType.error) {
					isError = true;
					isTimed = true;
					numOfButtons = 0;
				} else if (type === notificationType.nameInput || type === notificationType.botSelect) {
					isError = false;
					isTimed = false;
					numOfButtons = 1;
				} else if (type === notificationType.invite || type === notificationType.nextRound) {
					isError = false;
					isTimed = false;
					numOfButtons = 2;
				}

				return {
					type: type,
					id: notificationStore.id + 1,
					message: msg,
					isError,
					isTimed,
					numOfButtons,
					onButton1Click: btn1,
					onButton2Click: btn2,
				}
			})
			useSceneStore.getState().setShowWindow("notification", true);
		},
		setIsValid: (valid) => set({ isValid: valid}),
>>>>>>> origin/int/KAN-36-website-db
	}),
);