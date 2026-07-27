import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameValues {
	totalPlayers: number;
	playerNames: (string | null)[];
	isReadyToPlay: boolean[];
	gameStarted: boolean;
	activePlayer: number;
	cardsLeft: number[];
	round: number;
}

interface GameState extends GameValues {
	setGameValue: <K extends keyof GameValues>(key: K, value: GameValues[K]) => void;
	setActivePlayer: () => void;
	dealCards: () => void;
	setCardsLeft: (player: number, cardsPlayed: number) => void;
	incRound: () => void;
}

export const useGameStore = create<GameState>() (
	persist(
		(set) => ({
			totalPlayers: 1,
			playerNames: [null],
			isReadyToPlay: [false],
			gameStarted: false,
			activePlayer: 0,
			cardsLeft: [],
			round: 0,

			setGameValue: (key, value) => set(() => ({ [key]: value })),
			setActivePlayer: () => set((gameStore) => ({
				activePlayer: (gameStore.activePlayer + 1) % gameStore.totalPlayers
			})),
			dealCards: () => set((gameStore) => {
				const total = gameStore.totalPlayers;
				const round = gameStore.round;
				let cardsDealt = [];
				if (total === 3) {
					const cards = 52 / total;
					for (let i = 0; i < total; i++) {
						if (i === round % total)
							cardsDealt.push(Math.ceil(cards));
						else
							cardsDealt.push(Math.floor(cards));
					}
				} else {
					const cards = 52 / total;
					for (let i = 0; i < total; i++)
						cardsDealt.push(cards);
				}
				return {
					cardsLeft: cardsDealt
				}
			}),
			setCardsLeft: (player, cardsPlayed) => set((gameStore) => {
				const updatedCardsLeft = [...gameStore.cardsLeft];
				updatedCardsLeft[player] -= cardsPlayed;
				return {
					cardsLeft: updatedCardsLeft
				};
			}),
			incRound: () => set((gameStore) => ({ round: gameStore.round + 1 })),
		}),
		{
			name: 'game-storage',
		}
	)
);