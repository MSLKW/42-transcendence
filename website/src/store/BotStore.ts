import { create } from "zustand";
import { useGameStore } from "./GameStore";
import { cachedBotData, useProfileStore } from "./ProfileStore";

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

			useProfileStore.getState().setCachedData();

			get().countSeatedBots();
		},

		fillSeatsWithBots: () => {
			const totalPlayers = useGameStore.getState().totalPlayers;

			let bot_i = 0;
			for (let i = 0; i < totalPlayers; i++) {
				const { seats, setSeatWithUuid } = useGameStore.getState();
				if (seats[i])
					continue;

				while (bot_i < cachedBotData.length && seats.includes(cachedBotData[bot_i].uuid)) {
					bot_i++;
				}
				if (bot_i >= cachedBotData.length)
					break;

				const bot = cachedBotData[bot_i];
				setSeatWithUuid(bot.uuid!, i);

				const cached = useProfileStore.getState().cachedData;
				useProfileStore.setState({ cachedData: [...cached, cachedBotData[bot_i]]});

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