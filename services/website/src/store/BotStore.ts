import { create } from "zustand";
import { useGameStore } from "./GameStore";
import { useProfileStore, type CachedData } from "./ProfileStore";
import { gameInstance } from "../api/game/main";
import type { SeatOrderTransmit } from "@big2/game-types";

export const INTEL_LABEL = [
	"Easy",
	"Medium",
	"Hard",
 ] as const;
export type INTEL_TYPE = typeof INTEL_LABEL[number];

export const cachedBotData: Record<number, CachedData> = {
	0: {
		name: "Norminette",
		avatar: "avatar-bot-0.webp",
		relation: "Bot",
		badge: "Newcomer",
	},
	1: {
		name: "Moulinette",
		avatar: "avatar-bot-1.webp",
		relation: "Bot",
		badge: "Newcomer",
	},
	2: {
		name: "Thila-Bot",
		avatar: "avatar-bot-2.webp",
		relation: "Bot",
		badge: "Newcomer",
	},
	3: {
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
	cacheBotProfile: (seatData: SeatOrderTransmit) => void
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
			useProfileStore.getState().clearCachedData();
			await useProfileStore.getState().setCachedData();
		},

		fillSeatsWithBots: () => {
			const userSeats = useGameStore.getState().userSeats;
			for (let i = 0; i < userSeats.length; i++) {
				if (userSeats[i] === null) {
					gameInstance?.addBot(i);
				}
			}
		},

		countSeatedBots: () => {
			const userSeats = useGameStore.getState().userSeats;
			const count = userSeats.filter((seat) => seat?.startsWith("bot-")).length;
			set({ botCount: count });
		},

		cacheBotProfile: (seatData: SeatOrderTransmit) => {
			const cached = useProfileStore.getState().cachedData;
			const cachedUuids = Object.keys(cached);
			for (let i = 0; i < seatData.seatOrder.length; i++) {
				const seatUuid: string = seatData.seatOrder[i] ?? "";
				if (seatUuid.length === 0)
					continue ;
				const inCachedUuids = cachedUuids.find((uuid) => uuid === seatUuid);
				if (inCachedUuids === undefined) {
					useProfileStore.setState({
						cachedData: {
							...cached,
							[seatUuid]: {
								name: cachedBotData[i]?.name,
								avatar: cachedBotData[i]?.avatar,
								badge: cachedBotData[i]?.badge,
								relation: cachedBotData[i]?.relation,
							},
						},
					});
				}	
			}
		}
	}),
);
