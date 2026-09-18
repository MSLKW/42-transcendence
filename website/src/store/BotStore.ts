import { create } from "zustand";
import { useGameStore } from "./GameStore";
import { useProfileStore, type CachedData } from "./ProfileStore";

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
			if (get().botCount <= 0)
				return;

			const seats = useGameStore.getState().seats;
			const newSeats = seats.filter(seat => !seat?.includes("bot"));
			useGameStore.setState({ seats: newSeats });

			useProfileStore.getState().clearCachedData();
			await useProfileStore.getState().setCachedData();

			get().countSeatedBots();
		},

		fillSeatsWithBots: () => {
			const totalPlayers = useGameStore.getState().totalPlayers;

			let bot_i = 0;
			for (let i = 0; i < totalPlayers; i++) {
				const { seats, setSeatWithUuid } = useGameStore.getState();
				if (seats[i])
					continue;

				const botKeys = Object.keys(cachedBotData);
				while (bot_i < Object.keys(cachedBotData).length && seats.includes(botKeys[bot_i])) {
					bot_i++;
				}
				if (bot_i >= Object.keys(cachedBotData).length)
					break;
				setSeatWithUuid(botKeys[bot_i]!, i);

				const cached = useProfileStore.getState().cachedData;
				useProfileStore.setState({
					cachedData: {
						...cached,
						[botKeys[bot_i]!]: {
							name: cachedBotData[botKeys[bot_i]]?.name,
							avatar: cachedBotData[botKeys[bot_i]]?.avatar,
							badge: cachedBotData[botKeys[bot_i]]?.badge,
							relation: cachedBotData[botKeys[bot_i]]?.relation,
						},
					},
				});

				bot_i++;
			}
			get().countSeatedBots();
		},

		countSeatedBots: () => {
			const seats = useGameStore.getState().seats;
			const count = seats.filter((s) => s?.includes("bot")).length;
			set({ botCount: count });
		},
	}),
);
