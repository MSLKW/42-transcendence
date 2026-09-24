import { create } from "zustand";
import { persist } from "zustand/middleware";
<<<<<<< HEAD
import { useSceneStore } from "./SceneStore";

interface DevValues {
	showDevSection: boolean;
=======
import { usePlayerStore, STATUS } from "./PlayerStore";
import { usePartyStore, RELATION, SEATNUMBER_UNSEATED } from "./PartyStore";
import { useSceneStore } from "./SceneStore";

interface DevValues {
>>>>>>> origin/int/KAN-36-website-db
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
<<<<<<< HEAD
			showDevSection: true,
=======
>>>>>>> origin/int/KAN-36-website-db
			showFrame: false,
			showStats: false,

			toggleFlag: (key) => set((devStore) => ({ [key]: !devStore[key] })),
			resetGame: () => {
				useSceneStore.setState({
<<<<<<< HEAD
=======
					currentScene: "LOGIN",
					profileIndex: 0,
>>>>>>> origin/int/KAN-36-website-db
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
<<<<<<< HEAD
				useSceneStore.getState().setCurrentScene("Login");
=======
				usePlayerStore.setState({
					data: {
						uuid: "12345678-abcd-efgh-ijkl-000000000000",
						name: null,
						avatar: "avatar-stock-0.webp",
						badge: "Newcomer",
						level: 1,
						xp: 0,
						createdAt: "15 July 2026",
						lastLogin: "15 July 2026",
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
						uuid: "12345678-abcd-efgh-ijkl-000000000000",
						name: null,
						avatar: "avatar-stock-0.webp",
						badge: "Newcomer",
						level: 1,
						xp: 0,
						createdAt: new Date(1784110862000).toISOString(),
						lastLogin: new Date().toISOString(),
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
>>>>>>> origin/int/KAN-36-website-db
			},
		}),
		{
			name: "dev-storage",
		}
	)
);