import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useProfileStore, STATUS } from "./ProfileStore";
import { usePartyStore, RELATION, SEATNUMBER_UNSEATED } from "./PartyStore";
import { useSceneStore } from "./SceneStore";

interface DevValues {
	showFrame: boolean;
	showStats: boolean;
}

interface DevState extends DevValues {
	toggleFlag: (key: keyof DevValues) => void;
	resetGame: () => void;
}

export const useDevStore = create<DevState>()(
	persist(
		(set) => ({
			showFrame: false,
			showStats: false,

			toggleFlag: (key) => set((devStore) => ({ [key]: !devStore[key] })),
			resetGame: () => {
				useSceneStore.setState({
					currentScene: "LOGIN",
					profileIndex: 0,
					showWindow: {
						badge: false,
						createAccount: false,
						signIn: false,
						settings: false,
						info: false,
						profile: false,
						stats: false,
						party: false,
						chat: false,
						rank: false,
					},
				});
				useProfileStore.setState({
					data: {
						uuid: "",
						name: null,
						avatar: "avatar-stock-0.webp",
						badge: "Newcomer",
						level: 1,
						xp: 0,
						createdAt: 1784110862000,
						lastLogin: 1784110862000,
						totalPlayed: 0,
						totalWins: 0,
						totalLoss: 0,
						winStreak: 0,
						achievements: {
							FIRST_LOGIN: null,
							LOGIN_1_WEEK: null,
							PLAYED_1_GAME: null,
							PLAYED_10_GAMES: null,
							PLAYED_42_GAMES: null,
							FIRST_WIN: null,
							WIN_STREAK_2: null,
							WIN_STREAK_5: null,
							WIN_STREAK_10: null,
							MASTER_COLLECTOR: null,
						},
					},
					status: STATUS.AVAILABLE,
				});
				usePartyStore.setState({
					totalMembers: 1,
					members: [{
						uuid: "",
						name: null,
						avatar: "avatar-stock-0.webp",
						badge: "Newcomer",
						level: 1,
						xp: 0,
						createdAt: 1784110862000,
						lastLogin: 1784110862000,
						totalPlayed: 0,
						totalWins: 0,
						totalLoss: 0,
						winStreak: 0,
						achievements: {
							FIRST_LOGIN: null,
							LOGIN_1_WEEK: null,
							PLAYED_1_GAME: null,
							PLAYED_10_GAMES: null,
							PLAYED_42_GAMES: null,
							FIRST_WIN: null,
							WIN_STREAK_2: null,
							WIN_STREAK_5: null,
							WIN_STREAK_10: null,
							MASTER_COLLECTOR: null,
						},
						seatNumber: SEATNUMBER_UNSEATED,
						isHost: true,
						relation: RELATION.SELF,
					}],
				});
			},
		}),
		{
			name: "dev-storage",
		}
	)
);