import { create } from "zustand";
import { useSceneStore } from "./SceneStore";

export const NOTIFICATION_TYPE = {
	error: 0,
	message: 1,
	nameInput: 2,
	invite: 3,
	botSelect: 4,
	nextRound: 5,
} as const;

interface NotificationValues {
	type: number;
	id: number;
	message: string;
	isError: boolean;
	isTimed: boolean;
	numOfButtons: number;
	isValid?: boolean;
	onButton1Click?: () => void;
	onButton2Click?: () => void;
}

interface NotificationState extends NotificationValues {
	showNotification: (
		msg: string,
		type: number,
		btn1?: () => void,
		btn2?: () => void,
	) => void;
	setIsValid: (valid: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
	(set) => ({
		type: NOTIFICATION_TYPE.error,
		id: 0,
		message: "Welcome to Big 2!",
		isError: false,
		isTimed: true,
		numOfButtons: 0,
		onButton1Click: undefined,
		onButton2Click: undefined,

		showNotification: (msg, type, btn1, btn2) => {
			set((notificationStore) => {
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
				} else if (type === NOTIFICATION_TYPE.nameInput || type === NOTIFICATION_TYPE.botSelect) {
					isError = false;
					isTimed = false;
					numOfButtons = 1;
				} else if (type === NOTIFICATION_TYPE.invite || type === NOTIFICATION_TYPE.nextRound) {
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
	}),
);