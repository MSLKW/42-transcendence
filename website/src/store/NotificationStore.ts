import { create } from "zustand";
import { useSceneStore } from "./SceneStore";

interface NotificationValues {
	id: number
	message: string;
	isError: boolean;
	isTimed: boolean;
	numOfButtons: number;
	isValid?: boolean;
	onButton1Click?: () => void;
	onButton2Click?: () => void;
}

export const notificationType = {
	isError: 0,
	isNameInput: 1,
	isInvitation: 2,
} as const;

interface NotificationState extends NotificationValues {
	setNotification: (
		msg: string,
		type: number,
		btn1?: () => void,
		btn2?: () => void,
	) => void;
	setIsValid: (valid: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
	(set) => ({
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

				if (type === notificationType.isError) {
					isError = true;
					isTimed = true;
					numOfButtons = 0;
				} else if (type === notificationType.isNameInput) {
					isError = false;
					isTimed = false;
					numOfButtons = 1;
				} else if (type === notificationType.isInvitation) {
					isError = false;
					isTimed = false;
					numOfButtons = 2;
				}

				return {
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