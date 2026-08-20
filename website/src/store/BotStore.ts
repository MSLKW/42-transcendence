import { create } from "zustand";
import { usePartyStore, type MemberData } from "./PartyStore";
import { useGameStore } from "./GameStore";

export const INTEL_LABEL = [
	"Easy",
	"Medium",
	"Hard",
 ] as const;
 export type INTEL_TYPE = typeof INTEL_LABEL[number];

interface BotValues {
	bots: MemberData[],
	intel: INTEL_TYPE,
	botCount: number,
};

interface BotState extends BotValues {
	getBotData: (index: number) => MemberData | undefined,
	addBotToParty: (uuid: string) => void,
	addBotIfMissing: () => void;
	removeBots: () => void,
	fillSeatsWithBots: () => void,
	countSeatedBots: () => void,
	setIntel: (intel: INTEL_TYPE) => void,
};

export const useBotStore = create<BotState>() (
	(set, get) => ({
		bots: [
			{
				uuid: "bot-0",
				name: "Norminette",
				avatar: "stock-5.webp",
				relation: "Bot",
			},
			{
				uuid: "bot-1",
				name: "Moulinette",
				avatar: "stock-6.webp",
				relation: "Bot",
			},
			{
				uuid: "bot-2",
				name: "Thila-Bot",
				avatar: "stock-7.webp",
				relation: "Bot",
			},
			{
				uuid: "bot-3",
				name: "SegFault",
				avatar: "stock-8.webp",
				relation: "Bot",
			},
		],
		intel: "Medium",
		botCount: 0,

		getBotData: (index) => {
			const bots = get().bots;
			return bots[index];
		},

		addBotToParty: (uuid) => {
			const bot = get().bots.find(b => b.uuid === uuid);
			if (!bot)
				return;

			const partyMembers = usePartyStore.getState().members;
			if (partyMembers.some(m => m.uuid === uuid))
				return;

			const newBot: MemberData = {
				uuid: bot.uuid,
				name: bot.name,
				avatar: bot.avatar,
				relation: bot.relation,
			}

			usePartyStore.setState({
				members: [...partyMembers, newBot]
			});
		},

		addBotIfMissing: () => {
			const totalPlayers = useGameStore.getState().totalPlayers;
			const seats = useGameStore.getState().seats;

			let i = 0;
			while (i < totalPlayers) {
				const bot_uuid = `bot-${i}`;
				const botExistInParty = usePartyStore.getState().getMemberData(bot_uuid);
				if (seats.includes(bot_uuid) && !botExistInParty)
					useBotStore.getState().addBotToParty(bot_uuid);
				i++;
			}
		},

		removeBots: () => {
			const partyMembers = usePartyStore.getState().members;
			const newMembers = partyMembers.filter(member => member.relation !== "Bot");
			usePartyStore.setState({
				members: newMembers,
			});

			const seats = useGameStore.getState().seats;
			const newSeats = seats.map(seat => seat?.includes("bot") ? null : seat);
			useGameStore.setState({
				seats: newSeats,
			})

			get().countSeatedBots();
		},

		fillSeatsWithBots: () => {
			const { totalPlayers } = useGameStore.getState();
			const bots = get().bots;

			let bot_i = 0;
			for (let i = 0; i < totalPlayers; i++) {
				const { seats, setSeatWithUuid } = useGameStore.getState();
				if (seats[i])
					continue;

				while (bot_i < bots.length && seats.includes(bots[bot_i].uuid)) {
					bot_i++;
				}
				if (bot_i >= bots.length)
					break;

				const bot = bots[bot_i];
				get().addBotToParty(bot.uuid!);
				setSeatWithUuid(bot.uuid!, i);
				bot_i++;
			}
			get().countSeatedBots();
		},

		countSeatedBots: () => {
			const seats = useGameStore.getState().seats;
			const count = seats.filter((s) => s?.includes("bot")).length;
			set({
				botCount: count,
			});
		},

		setIntel: (intel) => {
			set({
				intel: intel,
			});
		},
	}),
)