import { create } from "zustand";

interface TypingValues {
	typingUsers: Record<string, boolean>;
}

interface TypingState extends TypingValues {
	setTyping: (senderUuid: string, isTyping: boolean) => void;
}

export const useTypingStore = create<TypingState>(
	(set) => ({
		typingUsers: {},

		setTyping: (senderUuid, isTyping) => {
			if (isTyping) {
				set((state) => ({
					typingUsers: {
						...state.typingUsers,
						[senderUuid]: true,
					},
				}));
			} else {
				set((state) => {
					const typingUsers = { ...state.typingUsers };
					delete typingUsers[senderUuid];
					return { typingUsers };
				});
			}
		},
	}),
);