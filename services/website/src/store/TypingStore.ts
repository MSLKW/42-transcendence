import { create } from "zustand";

const TYPING_TIMEOUT_MS = 5_000;
const typingTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const clearTypingTimeout = (senderUuid: string) => {
	const timeout = typingTimeouts.get(senderUuid);
	if (timeout) {
		clearTimeout(timeout);
		typingTimeouts.delete(senderUuid);
	}
}
const removeTypingUser = (senderUuid: string) => {
	useTypingStore.setState((state) => {
		if (!(senderUuid in state.typingUsers))
			return state;

		const typingUsers = { ...state.typingUsers };
		delete typingUsers[senderUuid];
		return { typingUsers };
	});
};

interface TypingValues {
	typingUsers: Record<string, boolean>;
}

interface TypingState extends TypingValues {
	setTyping: (senderUuid: string, isTyping: boolean) => void;
	resetValues: () => void;
}

export const useTypingStore = create<TypingState>(
	(set) => ({
		typingUsers: {},

		setTyping: (senderUuid, isTyping) => {
			clearTypingTimeout(senderUuid);

			if (!isTyping) {
				set((state) => {
					if (!(senderUuid in state.typingUsers))
						return state;

					const typingUsers = { ...state.typingUsers };
					delete typingUsers[senderUuid];
					return { typingUsers };
				});

				return;
			}

			set((state) => ({
				typingUsers: {
					...state.typingUsers,
					[senderUuid]: true,
				},
			}));

			const timeout = setTimeout(() => {
				if (typingTimeouts.get(senderUuid) !== timeout)
					return;

				typingTimeouts.delete(senderUuid);
				removeTypingUser(senderUuid);
			}, TYPING_TIMEOUT_MS);

			typingTimeouts.set(senderUuid, timeout);
		},

		resetValues: () => {
			for (const timeout of typingTimeouts.values()) {
				clearTimeout(timeout);
			}
			typingTimeouts.clear();

			set({ typingUsers: {} });
		},
	}),
);