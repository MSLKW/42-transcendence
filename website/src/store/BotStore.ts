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
};

interface BotState extends BotValues {
	getBotData: (index: number) => MemberData | undefined,
	addBotToParty: (uuid: string) => void,
	removeBotsFromParty: () => void,
	fillSeatsWithBots: () => void,
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

		getBotData: (index) => {
			const bots = get().bots;
			return bots[index];
		},
		
		addBotToParty: (uuid) => {
			const bot = get().bots.find(b => b.uuid === uuid);
			if (!bot)
				return;

			const currentMembers = usePartyStore.getState().members;

			if (currentMembers.some(m => m.uuid === uuid) || currentMembers.length >= 4)
				return;

			usePartyStore.setState({
				members: [
					...currentMembers,
					{
						uuid: bot.uuid,
						name: bot.name,
						avatar: bot.avatar,
						relation: bot.relation,
					}
				]
			});
		},

		removeBotsFromParty: () => {
			const currentMembers = usePartyStore.getState().members;
			const newMembers = currentMembers.filter(member => member.relation != "Bot");
			usePartyStore.setState({
				members: newMembers,
			});

			const seats = useGameStore.getState().seats;
			const newSeats = seats.map(seat => seat?.includes("bot") ? null : seat);
			useGameStore.setState({
				seats: newSeats,
			})
		},

		fillSeatsWithBots: () => {
			let i = 0;
			let bot_i = 0;
			while (i < useGameStore.getState().totalPlayers) {
				if (!useGameStore.getState().seats[i]) {
					useBotStore.getState().addBotToParty(`bot-${bot_i}`);
					useGameStore.getState().setSeatWithUuid(`bot-${bot_i}`, i);
					bot_i++;
				}
				i++;
			}
		},

		setIntel: (intel) => {
			set({
				intel: intel,
			});
		},
	}),
)