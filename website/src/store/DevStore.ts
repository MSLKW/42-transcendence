import { create } from "zustand";
import { persist } from "zustand/middleware";
import { usePlayerStore, STATUS, SEATNUMBER_UNSEATED } from "./PlayerStore";
import { usePartyStore, ISFRIEND } from "./PartyStore";
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
				});
				usePlayerStore.setState({
					data: {
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
						isSeated: false,
						seatNumber: -1,
					},
					status: STATUS.AVAILABLE,
				});
				usePartyStore.setState({
					partyCount: 1,
					members: [{
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
						isSeated: false,
						seatNumber: SEATNUMBER_UNSEATED,
						isHost: true,
						isFriend: ISFRIEND.NA,
					}],
				});
			},
		}),
		{
			name: "dev-storage",
		}
	)
);