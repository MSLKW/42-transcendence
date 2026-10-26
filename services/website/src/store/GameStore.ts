import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./AuthStore";
import { usePartyStore } from "./PartyStore";
import { useResultsStore } from "./ResultsStore";
import { useSceneStore } from "./SceneStore";
import { gameInstance } from '../api/game/main';
import { partySocket } from "../api/party/partySocket";
import { HandType, PentupleType, type CardHandTransmit, type CardTransmit } from "@big2/game-types";
import { useSettingsStore } from "./SettingsStore";

export const GAMEMODE_LABEL = [
	"4 Players",
	"3 Players",
	"2 Players",
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
	gameVerboseMode: boolean,
	gameSocketId: string | null,
	totalPlayers: number;
	gameSeats: (string | null)[];
	userSeats: (string | null)[];
	playerDisconnection: Record<string, boolean>;
	gameStarted: boolean;
	cardsLeft: number[];
	currentHand: HAND_TYPE;
	selectedCards: CardHandTransmit | undefined;
	cardHeapTopCards: CardHandTransmit | undefined;
	lowestCardRequired: CardTransmit | undefined;
	round: number;
	seatRef: number[];
	activeSeat: number;
	isActiveSeatSkippable: boolean;
	isCardHandPlayable: boolean;
	sortType: string;
	playerPassed: string[];
	playerTimer: number;
	playerRemainingTimer: number;
}

interface GameState extends GameValues {
	initSeats: () => void;
	takeSeat: (seatNumber: number) => void;
	leaveSeat: () => void;
	autoSetSeats: () => void;

	setSeatRef: (seats: (string | null)[]) => void;
	setCardsLeft: (playerCardsAmount: Record<string, number>) => void;
	reduceCardsLeft: (uuid: string, cardsAmount: number) => void;
	setSelectedCards: (cardHand: CardHandTransmit) => void;
	setCurrentHand: (handType: HandType, pentupleType: PentupleType) => void;
	setCardHandPlayable: () => void;
	resetLobby: () => void;
	resetGame: () => void;
	startGame: () => void;
	skipTurn: () => void;

	leaveGame: () => void;

	clearPassedPlayer: (playerUuid: string) => void;
	resetValues: () => void;
}

export const useGameStore = create<GameState>() (
	persist(
		(set, get) => ({
			gameVerboseMode: false,
			gameSocketId: null,
			totalPlayers: 0,
			userSeats: [],
			gameSeats: [],
			playerDisconnection: {},
			gameStarted: false,
			cardsLeft: [],
			currentHand: "None",
			selectedCards: undefined,
			cardHeapTopCards: undefined,
			lowestCardRequired: undefined,
			round: 0,
			seatRef: [],
			activeSeat: 0,
			isActiveSeatSkippable: false,
			isCardHandPlayable: false,
			sortType: "Flex",
			playerPassed: [],
			playerTimer: 0,
			playerRemainingTimer: 0,

			initSeats: () => {
				const totalPlayers = get().totalPlayers;
				const newSeats = Array(totalPlayers).fill(null);
				set({ userSeats: newSeats });
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
				set({ userSeats: newSeats });
			},

			setSeatRef: (seats: (string | null)[]) => {
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
				get().gameSeats.forEach((playerUuid) => {
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
				const seatIndex = get().gameSeats.findIndex((seatUuid) => seatUuid === uuid);
				cardsLeft[seatIndex] = cardsLeft[seatIndex] - cardsAmount;
				set({ cardsLeft: cardsLeft });
			},
			setCardHeapTopCards: (cardHand: CardHandTransmit) => {
				if (cardHand.cards.length !== 0) {
					set({ cardHeapTopCards: cardHand });
				}
				else {
					set({ cardHeapTopCards: undefined });
				}
			},
			setSelectedCards: (cardHand: CardHandTransmit) => {
				if (cardHand.cards.length !== 0) {
					set({ selectedCards: cardHand });
				}
				else {
					set({ selectedCards: undefined });
				}
				get().setCurrentHand(cardHand.handType, cardHand.pentupleType);
				get().setCardHandPlayable();
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
			setCardHandPlayable: () => {
				// Copied & edited from CardHeapState.ts
				const checkPlayable = () => {
					const topCardHand = get().cardHeapTopCards;
					const selectedCards = get().selectedCards;
					if (selectedCards === undefined)
						return (false);
					if (selectedCards.handType === HandType.None || (selectedCards.handType === HandType.Pentuple && selectedCards.pentupleType === PentupleType.None))
						return (false);
					if (useSettingsStore.getState().allow3OfAKind === false && selectedCards.handType === HandType.Triple)
						return (false);
					const lowestCard = get().lowestCardRequired;
					if (lowestCard !== undefined && selectedCards.cards.find((card) => card.rank === lowestCard.rank && card.suit === lowestCard.suit) === undefined)
						return (false);
					if (topCardHand === undefined)
						return (true);
					if (get().isActiveSeatSkippable === false)
						return (true);
					if (selectedCards.handType !== topCardHand.handType)
						return (false);
					// Comparing
					if (selectedCards.handType === HandType.Single || selectedCards.handType === HandType.Double || selectedCards.handType === HandType.Triple) {
						if (selectedCards.cards[0].rank > topCardHand.cards[0].rank)
							return (true);
						else if (selectedCards.cards[0].rank === topCardHand.cards[0].rank && selectedCards.cards[0].suit > topCardHand.cards[0].suit)
							return (true);
					}
					else if (selectedCards.handType === HandType.Pentuple) {
						if (selectedCards.pentupleType > topCardHand.pentupleType)
							return (true);
						else if (selectedCards.pentupleType < topCardHand.pentupleType)
							return (false);
						if (selectedCards.pentupleType === PentupleType.Straight || selectedCards.pentupleType === PentupleType.Flush || selectedCards.pentupleType === PentupleType.StraightFlush) {
							if (selectedCards.cards[0].rank > topCardHand.cards[0].rank)
								return (true);
							else if (selectedCards.cards[0].rank === topCardHand.cards[0].rank && selectedCards.cards[0].suit > topCardHand.cards[0].suit)
								return (true);
						}
						else if (selectedCards.pentupleType === PentupleType.FullHouse || selectedCards.pentupleType === PentupleType.FourOfAKind) {
							if (selectedCards.cards[2].rank > topCardHand.cards[2].rank) {
								return (true);
							}
						}
					}
					return (false);
				}
				set({ isCardHandPlayable: checkPlayable()});
			},
			startGame: () => {
				gameInstance?.startGame();
			},
			skipTurn: () => {
				gameInstance?.playerRef?.skipTurnButtonHandler();
			},

			resetLobby: () => {
				set({
					totalPlayers: 0,
					userSeats: [],
					playerDisconnection: {},
					round: 0,
					seatRef: [],
				});
				get().resetGame();
				useResultsStore.getState().resetResults();
				useSceneStore.getState().setShowWindow("results", false);
			},

			resetGame: () => {
				set({
					gameSeats: [],
					gameStarted: false,
					cardsLeft: [],
					currentHand: "None",
					selectedCards: undefined,
					cardHeapTopCards: undefined,
					lowestCardRequired: undefined,
					activeSeat: 0,
					playerPassed: [],
					playerTimer: 0,
					playerRemainingTimer: 0,
					isActiveSeatSkippable: false,
					isCardHandPlayable: false,
				});
			},

			leaveGame: () => {
				if (useAuthStore.getState().clientUuid === usePartyStore.getState().hostUuid && useGameStore.getState().gameStarted === false) {
					gameInstance?.deleteLobby();
					partySocket.refresh();
				}
				else {
					partySocket.leaveParty();
					gameInstance?.disconnect();
				}
				get().resetLobby();
				const currentScene = useSceneStore.getState().currentScene;
				if (currentScene === "Lobby" || currentScene === "Game") {
					useSceneStore.getState().setCurrentScene("Home");
				}
			},

			clearPassedPlayer: (playerUuid: string) => {
				const newPlayerPassed = [...get().playerPassed];
				const index = newPlayerPassed.findIndex((skippedUuid) => skippedUuid === playerUuid);
				if (index !== -1) {
					newPlayerPassed.splice(index, 1);
					set({ playerPassed: newPlayerPassed });
				}
			},

			resetValues: () => {
				set({
					gameSocketId: null,
					totalPlayers: 0,
					userSeats: [],
					gameSeats: [],
					playerDisconnection: {},
					gameStarted: false,
					cardsLeft: [],
					currentHand: "None",
					selectedCards: undefined,
					cardHeapTopCards: undefined,
					lowestCardRequired: undefined,
					round: 0,
					seatRef: [],
					activeSeat: 0,
					isActiveSeatSkippable: false,
					isCardHandPlayable: false,
					sortType: "Flex",
					playerPassed: [],
					playerTimer: 0,
					playerRemainingTimer: 0,
				});
			},
		}),
		{
			name: 'game-storage',
		}
	)
);