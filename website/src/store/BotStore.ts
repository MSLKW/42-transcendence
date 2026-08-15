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
		botCount: 0,

		getBotData: (index) => {
			const bots = get().bots;
			return bots[index];
		},

		addBotToParty: (uuid) => {
			const bot = get().bots.find(b => b.uuid === uuid);
			if (!bot)
				return;
			const newBot = {
				uuid: bot.uuid,
				name: bot.name,
				avatar: bot.avatar,
				relation: bot.relation,
			}

			const partyMembers = usePartyStore.getState().members;
			if (partyMembers.some(m => m.uuid === uuid))
				return;
			usePartyStore.setState({
				members: [
					...partyMembers,
					newBot,
				]
			});
		},

		removeBotsFromParty: () => {
			const partyMembers = usePartyStore.getState().members;
			const newMembers = partyMembers.filter(member => member.relation != "Bot");
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
			const { totalPlayers, seats, setSeatWithUuid } = useGameStore.getState();
			let bot_i = 0;
			for (let i = 0; i < totalPlayers; i++) {
				if (!seats[i]) {
					const bot_uuid = `bot-${bot_i}`;
					get().addBotToParty(bot_uuid);
					setSeatWithUuid(bot_uuid, i);
					bot_i++;
					set({ botCount: bot_i - 1 })
				}
			}
		},

		setIntel: (intel) => {
			set({
				intel: intel,
			});
		},
	}),
)