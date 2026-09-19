import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./AuthStore";
import { useProfileStore, type MEDAL_TYPE } from "./ProfileStore";
import { usePartyStore } from "./PartyStore";
import { useResultsStore } from "./ResultsStore";
import { useSceneStore } from "./SceneStore";
import { gameInstance } from '../api/game/src/main';
import { chatSocket } from "../api/chat/chatSocket";
import { partySocket } from "../api/party/partySocket";
import { HandType, PentupleType } from "@big2/game-types";

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
	"None": 0,
} as const;
export type HAND_TYPE = keyof typeof HAND_VALUES;
export const HAND_LABEL = Object.keys(HAND_VALUES) as HAND_TYPE[];

interface GameValues {
	totalPlayers: number;
	seats: (string | null)[];
	gameStarted: boolean;
	cardsLeft: number[];
	currentHand: string;
	round: number;
	seatRef: number[];
	activeSeat: number;
	isActiveSeatSkippable: boolean;
	sortType: string;
}

interface GameState extends GameValues {
	initSeats: () => void;
	takeSeat: (seatNumber: number) => void;
	leaveSeat: () => void;
	autoSetSeats: () => void;
	
	setSeatRef: () => void;
	setCardsLeft: (playerCardsAmount: Record<string, number>) => void;
	reduceCardsLeft: (uuid: string, cardsAmount: number) => void;
	setCurrentHand: (handType: HandType, pentupleType: PentupleType) => void;
	startGame: () => void;
	skipTurn: () => void;

	endGame: () => void;
	incTotalWin: (uuid: string) => void;
	incTotalLoss: (uuid: string) => void;
	unlockMedal: (uuid: string, type: MEDAL_TYPE) => void;
}

export const useGameStore = create<GameState>() (
	persist(
		(set, get) => ({
			totalPlayers: 1,
			seats: [],
			gameStarted: false,
			cardsLeft: [],
			currentHand: "None",
			round: 0,
			seatRef: [],
			activeSeat: 0,
			isActiveSeatSkippable: false,
			sortType: "Flex",

			initSeats: () => {
				const totalPlayers = get().totalPlayers;
				const newSeats = Array(totalPlayers).fill(null);
				set({ seats: newSeats });
			},
			takeSeat: (seatNumber) => {
				gameInstance?.takeSeat(seatNumber);
			},
			leaveSeat: () => {
				gameInstance?.leaveSeat();
			},
			autoSetSeats: () => {
				const members = usePartyStore.getState().members;
				const newSeats = members.map((member) => member).filter((uuid): uuid is string => uuid !== null);
				set({ seats: newSeats });
			},

			setSeatRef: () => {
				const seats = get().seats;
				const clientUuid = useAuthStore.getState().clientUuid;
				const totalPlayers = get().totalPlayers;
				const clientIndex = seats.indexOf(clientUuid);
				if (clientIndex === -1) {
					const defaultSeatRef = Array.from({ length: totalPlayers }, (_, i) => i);
					set({
						seatRef: defaultSeatRef,
					});
					return;
				}

				const newSeatRef = Array.from({ length: totalPlayers }, (_, i) => {
					return (i + clientIndex) % totalPlayers;
				});
				set({
					seatRef: newSeatRef,
				});
			},
			setCardsLeft: (playerCardsAmount: Record<string, number>) => {
				const newCardsLeft: number[] = []
				get().seats.forEach((playerUuid) => {
					if (playerUuid === null) {
						newCardsLeft.push(-1);
						return ;
					}
					newCardsLeft.push(playerCardsAmount[playerUuid] !== undefined ? playerCardsAmount[playerUuid] : -1);
				})
				set({ cardsLeft: newCardsLeft });
			},
			reduceCardsLeft: (uuid: string, cardsAmount: number) => {
				const cardsLeft = get().cardsLeft;
				const seatIndex = get().seats.findIndex((seatUuid) => seatUuid === uuid);
				cardsLeft[seatIndex] = cardsLeft[seatIndex] - cardsAmount;
				set({ cardsLeft: cardsLeft });
			},
			setCurrentHand: (handType: HandType, pentupleType: PentupleType) => {
				let newCurrentHand: HAND_TYPE = "None";
				if (handType === HandType.Pentuple) {
					switch (pentupleType) {
						case PentupleType.Straight: newCurrentHand = "Straight"; break;
						case PentupleType.Flush: newCurrentHand = "Flush"; break;
						case PentupleType.FullHouse: newCurrentHand = "Full House"; break;
						case PentupleType.FourOfAKind: newCurrentHand = "4 of a Kind"; break;
						case PentupleType.StraightFlush: newCurrentHand = "Straight Flush"; break;
					}
				}
				else {
					switch (handType) {
						case HandType.None: newCurrentHand = "None"; break;
						case HandType.Single: newCurrentHand = "High Card"; break;
						case HandType.Double: newCurrentHand = "Double"; break;
						case HandType.Triple: newCurrentHand = "Triple"; break;
					}
				}
				set({ currentHand: newCurrentHand });
			},
			startGame: () => {
				useSceneStore.getState().setShowWindow("results", false);
				gameInstance?.startGame();
			},
			skipTurn: () => {
				gameInstance?.playerRef?.skipTurnButtonHandler();
			},

			endGame: () => {
				set({
					totalPlayers: 0,
					seats: [],
					gameStarted: false,
					cardsLeft: [],
					currentHand: "None",
					round: 0,
					seatRef: [],
					activeSeat: 0,
				});
				useResultsStore.getState().resetResults();
				useSceneStore.getState().setShowWindow("results", false);
				useSceneStore.getState().setCurrentScene("Home");
				partySocket.leaveParty();
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
				const newLevel = Math.floor(newXp / 1000) + 1;

				useProfileStore.setState({
					profilesInDb: profileStore.profilesInDb.map((p) => p.uuid === uuid
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
				const newWinStreak = 0;
				const newLevel = Math.floor(newXp / 1000) + 1;

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