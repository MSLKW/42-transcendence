import { create } from "zustand";
import { usePartyStore, type MemberData } from "./PartyStore";

export const INTEL_LABEL = [
	"EASY",
	"MEDIUM",
	"HARD",
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
	setIntel: (intel: INTEL_TYPE) => void,
};

export const useBotStore = create<BotState>() (
	(set, get) => ({
		bots: [
			{
				uuid: "bot-1",
				name: "Norminette",
				avatar: "stock-5.webp",
				relation: "Bot",
			},
			{
				uuid: "bot-2",
				name: "Moulinette",
				avatar: "stock-6.webp",
				relation: "Bot",
			},
			{
				uuid: "bot-3",
				name: "Thila-Bot",
				avatar: "stock-7.webp",
				relation: "Bot",
			},
			{
				uuid: "bot-4",
				name: "SegFault",
				avatar: "stock-8.webp",
				relation: "Bot",
			},
		],
		intel: "MEDIUM",

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
			const filteredMembers = currentMembers.filter(member => member.relation != "Bot");

			usePartyStore.setState({
				members: filteredMembers,
			});
		},

		setIntel: (intel) => {
			set({
				intel: intel,
			});
		},
	}),
)