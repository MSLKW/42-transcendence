import { create } from "zustand";
import type { CHAT_TYPE } from "./ChatStore";

export interface BubbleMsg {
	id: string;
	type: CHAT_TYPE;
	message: string;
}

export const EMPTY_BUBBLES: BubbleMsg[] = [];

interface BubbleValues {
	bubbles: Record<string, BubbleMsg[]>;
}

interface BubbleState extends BubbleValues {
	addBubble: (uuid: string, type: CHAT_TYPE, message: string) => void;
	removeBubble: (uuid: string, bubbleId: string) => void;
	clearBubbles: (uuid: string) => void;
	clearAllBubbles: () => void;
}

const bubbleTimers = new Map<string, ReturnType<typeof setTimeout>>();

export const useBubbleStore = create<BubbleState>(
	(set, get) => ({
		bubbles: {},

		addBubble: (uuid, type, message) => {
			const id = crypto.randomUUID();
			set((state) => ({
				bubbles: {
					...state.bubbles,
					[uuid]: [
						...(state.bubbles[uuid] ?? []),
						{
							id,
							type,
							message,
						},
					],
				},
			}));

			const timer = setTimeout(() => {
				get().removeBubble(uuid, id);
			}, 4000);
			bubbleTimers.set(id, timer);
		},

		removeBubble: (uuid, bubbleId) => {
			const timer = bubbleTimers.get(bubbleId);
			if (timer) {
				clearTimeout(timer);
				bubbleTimers.delete(bubbleId);
			}

			set((state) => {
				const current = state.bubbles[uuid] ?? [];
				const updated = current.filter((bubble) => bubble.id !== bubbleId);

				return {
					bubbles: {
						...state.bubbles,
						[uuid]: updated,
					},
				};
			})
		},

		clearBubbles: (uuid) => {
			const current = get().bubbles[uuid] ?? [];
			for (const bubble of current) {
				const timer = bubbleTimers.get(bubble.id);
				if (timer) {
					clearTimeout(timer);
					bubbleTimers.delete(bubble.id);
				}
			}

			set((state) => ({
				bubbles: {
					...state.bubbles,
					[uuid]: [],
				},
			}));
		},

		clearAllBubbles: () => {
			for (const timer of bubbleTimers.values())
				clearTimeout(timer);
			bubbleTimers.clear();
			set({ bubbles: {} });
		},
	}),
);