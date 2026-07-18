import { create } from "zustand";

interface NotificationValues {
	message: string;
	isError: boolean;
	isTimed: boolean;
	call: () => void;
}

interface NotificationState extends NotificationValues {
	setMessage: (msg: string) => void;
	setIsError: (error: boolean) => void;
	setIsTimed: (timed: boolean) => void;
	// setCall: (func: Function) => void;
	setNotification: (msg: string, error?: boolean, timed?: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
	(set) => ({
		message: "hello",
		isError: false,
		isTimed: true,
		call: () => {},

		setMessage: (msg) => set({ message: msg }),
		setIsError: (error) => set({ isError: error }),
		setIsTimed: (timed) => set({ isTimed: timed }),
		// setCall: (func) => set({ call: func }),
		setNotification: (msg, error, timed) => set({
			message: msg,
			isError: error,
			isTimed: timed,
		}),
	}),
);