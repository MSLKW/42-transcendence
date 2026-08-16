import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useProfileStore, type MEDAL_TYPE } from "./ProfileStore";
import { usePartyStore } from "./PartyStore";

export const GAMEMODE_LABEL = [
	"4 Players",
	"3 Players",
	"2 Players",
	"Tutorial",
] as const;
export type GAMEMODE_TYPE = typeof GAMEMODE_LABEL[number];

export const HAND_VALUES = {
	"Straight Flush": 5,
	"4 of a Kind": 5,
	"Full House": 5,
	"Flush": 5,
	"Straight": 5,
	"Triple": 3,
	"Double": 2,
	"High Card": 1,
	"Open": 0,
} as const;
export type HAND_TYPE = keyof typeof HAND_VALUES;
export const HAND_LABEL = Object.keys(HAND_VALUES) as HAND_TYPE[];

interface GameValues {
	totalPlayers: number,
	seats: (string | null)[],
	gameStarted: boolean,
	cardsLeft: number[],
	currentHand: HAND_TYPE,
	round: number,
	activeSeat: number,
};

interface GameState extends GameValues {
	setGameValue: <K extends keyof GameValues>(key: K, value: GameValues[K]) => void,
	
	initSeats: () => void,
	setSeatWithUuid: (uuid: string, seatNumber: number) => void,
	playerUnseats: (uuid: string) => void,
	autoSetSeats: () => void,
	
	startGame: () => void;
	nextTurn: () => void;

	endGame: () => void;
	incTotalWin: (uuid: string) => void,
	incTotalLoss: (uuid: string) => void,
	unlockMedal: (uuid: string, type: MEDAL_TYPE) => void,
};

export const useGameStore = create<GameState>() (
	persist(
		(set, get) => ({
			totalPlayers: 1,
			seats: [],
			gameStarted: false,
			cardsLeft: [],
			currentHand: "Open",
			round: 0,
			activeSeat: 0,

			setGameValue: (key, value) => set(() => ({ [key]: value })),

			initSeats: () => {
				const totalPlayers = get().totalPlayers;
				const newSeats = Array(totalPlayers).fill(null);
				set({
					seats: newSeats,
				});
			},
			setSeatWithUuid: (uuid, seatNumber) => {
				const seats = get().seats;
				if (seats[seatNumber] === uuid)
					return;
				const newSeats = [...seats];

				const existingIndex = newSeats.indexOf(uuid);
				if (existingIndex !== -1)
					newSeats[existingIndex] = null;
				newSeats[seatNumber] = uuid;

				set({ seats: newSeats });
			},
			playerUnseats: (uuid) => {
				const newSeats = [...get().seats];
				const index = newSeats.findIndex(seat => seat === uuid);
				if (index !== -1) {
					newSeats[index] = null;
					set({
						seats: newSeats,
					});
				}
			},
			autoSetSeats: () => {
				const members = usePartyStore.getState().members;
				const newSeats = members
					.map((member) => member.uuid)
					.filter((uuid): uuid is string => uuid !== null);
				set({
					seats: newSeats,
				});
			},

			startGame: () => {
				set({
					round: get().round + 1,
				})
			},
			nextTurn: () => {
				const newActiveSeat = (get().activeSeat + 1) % get().totalPlayers;
				set({
					activeSeat: newActiveSeat,
				});
			},

			endGame: () => {
				set({
					totalPlayers: 1,
					seats: [],
					gameStarted: false,
					cardsLeft: [],
					currentHand: "Open",
					round: 0,
				});
			},
			incTotalWin: (uuid) => {
				const profileStore = useProfileStore.getState();
				const data = profileStore.getProfileData(uuid);
				if (!data)
					return;

				const newXp = data.xp + 420;
				const newTotalWins = data.totalWins + 1;
				const newTotalPlayed = data.totalPlayed + 1;
				const newWinStreak = data.winStreak + 1;
				const newLevel = Math.floor(data.xp / 1000) + 1;

				useProfileStore.setState({
					profilesInDb: profileStore.profilesInDb.map((p) =>
						p.uuid === uuid
							? {
								...p,
								xp: newXp,
								totalWins: newTotalWins,
								totalPlayed: newTotalPlayed,
								winStreak: newWinStreak,
								level: newLevel,
							}
							: p
					),
				});
			},
			incTotalLoss: (uuid) => {
				const profileStore = useProfileStore.getState();
				const data = profileStore.getProfileData(uuid);
				if (!data)
					return;

				const newXp = data.xp + 67;
				const newTotalPlayed = data.totalPlayed + 1;
				const newTotalLoss = data.totalLoss + 1;
				const newWinStreak = data.winStreak + 1;
				const newLevel = Math.floor(data.xp / 1000) + 1;

				useProfileStore.setState({
					profilesInDb: profileStore.profilesInDb.map((p) =>
						p.uuid === uuid
							? {
								...p,
								xp: newXp,
								totalLoss: newTotalLoss,
								totalPlayed: newTotalPlayed,
								winStreak: newWinStreak,
								level: newLevel,
							}
							: p
					),
				});
			},
			unlockMedal: (uuid, type) => {
				const profileStore = useProfileStore.getState();
				const data = profileStore.getProfileData(uuid);
				if (!data || data.medals[type] !== null)
					return;

				useProfileStore.setState({
					profilesInDb: profileStore.profilesInDb.map((p) => 
						p.uuid === uuid
							? {
								...p,
								medals: {
									...p.medals,
									[type]: new Date,
								},
							}
							: p
					)
				});
			},
		}),
		{
			name: 'game-storage',
		}
	)
);