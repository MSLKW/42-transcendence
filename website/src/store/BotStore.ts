import { create } from "zustand";
import { useGameStore } from "./GameStore";
import { useProfileStore, type CachedData } from "./ProfileStore";
import { gameInstance } from "../api/game/main";

export const INTEL_LABEL = [
	"Easy",
	"Medium",
	"Hard",
 ] as const;
export type INTEL_TYPE = typeof INTEL_LABEL[number];

export const cachedBotData: Record<string, CachedData> = {
	"bot-0": {
		name: "Norminette",
		avatar: "avatar-bot-0.webp",
		relation: "Bot",
		badge: "Newcomer",
	},
	"bot-1": {
		name: "Moulinette",
		avatar: "avatar-bot-1.webp",
		relation: "Bot",
		badge: "Newcomer",
	},
	"bot-2": {
		name: "Thila-Bot",
		avatar: "avatar-bot-2.webp",
		relation: "Bot",
		badge: "Newcomer",
	},
	"bot-3": {
		name: "Segfault",
		avatar: "avatar-bot-3.webp",
		relation: "Bot",
		badge: "Newcomer",
	},
};

interface BotValues {
	currentIntel: INTEL_TYPE;
	botCount: number;
}

interface BotState extends BotValues {
	removeBots: () => Promise<void>,
	fillSeatsWithBots: () => void,
	countSeatedBots: () => void,
};

export const useBotStore = create<BotState>() (
	(set, get) => ({
		currentIntel: "Medium",
		botCount: 0,

		removeBots: async () => {
			const userSeats = useGameStore.getState().userSeats;
			const seatedBots = userSeats.filter((seat) => seat?.startsWith("bot-"));
			for (let i = 0; i < seatedBots.length; i++) {
				const botId = seatedBots[i] ?? "";
				if (botId.length > 0) {
					gameInstance?.removeBot(botId);
				}
			}
			get().countSeatedBots();
		},

		fillSeatsWithBots: () => {
			const userSeats = useGameStore.getState().userSeats;
			for (let i = 0; i < userSeats.length; i++) {
				if (userSeats[i] === null) {
					gameInstance?.addBot(i);
				}
			}
			get().countSeatedBots();
		},

		countSeatedBots: () => {
			const seats = useGameStore.getState().userSeats;
			const count = seats.filter((seat) => seat?.startsWith("bot-")).length;
			set({ botCount: count });
		},
	}),
);
