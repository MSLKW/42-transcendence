import { create } from "zustand";
import { useGameStore } from "./GameStore";
import { cachedBotData } from "./ProfileStore";

export const INTEL_LABEL = [
	"Easy",
	"Medium",
	"Hard",
 ] as const;
 export type INTEL_TYPE = typeof INTEL_LABEL[number];

interface BotValues {
	currentIntel: INTEL_TYPE;
	botCount: number;
}

interface BotState extends BotValues {
	removeBots: () => void,
	fillSeatsWithBots: () => void,
	countSeatedBots: () => void,
};

export const useBotStore = create<BotState>() (
	(set, get) => ({
		currentIntel: "Medium",
		botCount: 0,

		removeBots: () => {
			if (get().botCount <= 0)
				return;

			const seats = useGameStore.getState().seats;
			const newSeats = seats.filter(seat => !seat?.includes("bot"));
			useGameStore.setState({ seats: newSeats });

			get().countSeatedBots();
		},

		fillSeatsWithBots: () => {
			const totalPlayers = useGameStore.getState().totalPlayers;
			const bots = cachedBotData;

			let bot_i = 0;
			for (let i = 0; i < totalPlayers; i++) {
				const { seats, takeSeat: takeSeat } = useGameStore.getState();
				if (seats[i])
					continue;

				while (bot_i < bots.length && seats.includes(bots[bot_i].uuid)) {
					bot_i++;
				}
				if (bot_i >= bots.length)
					break;

				const bot = bots[bot_i];
				takeSeat(bot.uuid!, i);
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
)