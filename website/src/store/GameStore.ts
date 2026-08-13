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

interface GameValues {
	totalPlayers: number,
	seats: (string | null)[],
	gameStarted: boolean,
	cardsLeft: number[],
}

interface GameState extends GameValues {
	setGameValue: <K extends keyof GameValues>(key: K, value: GameValues[K]) => void,
	initSeats: () => void,
	setSeatWithUuid: (uuid: string, seatNumber: number) => void,
	playerUnseats: (uuid: string) => void,
	autoSetSeats: () => void,
	incTotalWin: (uuid: string) => void,
	incTotalLoss: (uuid: string) => void,
	unlockMedal: (uuid: string, type: MEDAL_TYPE) => void,
}

export const useGameStore = create<GameState>() (
	persist(
		(set, get) => ({
			totalPlayers: 1,
			seats: [],
			gameStarted: false,
			cardsLeft: [],

			setGameValue: (key, value) => set(() => ({ [key]: value })),

			initSeats: () => {
				const totalPlayers = get().totalPlayers;
				const newSeats = Array(totalPlayers).fill(null);
				set({
					seats: newSeats,
				})
			},

			setSeatWithUuid: (uuid, seatNumber) => {
				const newSeats = [...get().seats];

				const existingIndex = newSeats.findIndex(seat => seat === uuid);
				if (existingIndex !== -1)
					newSeats[existingIndex] = null;

				newSeats[seatNumber] = uuid;
				set({
					seats: newSeats,
				});
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