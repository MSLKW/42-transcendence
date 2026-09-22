import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGameStore } from "./GameStore";
import type { GameEndStatsTransmit } from "@big2/game-types";

interface ResultsItem {
	uuid: string;
	points: number;
	totalPoints: number;
	totalWins: number; // investigate this
	rank: number;
	rankChanged: number;
}

interface ResultsValues {
	results: ResultsItem[];
}

interface ResultsState extends ResultsValues {
	setResults: (gameEndStats: GameEndStatsTransmit) => void;
	resetResults: () => void;
	getLeaderboard: () => ResultsItem[];
}

export const useResultsStore = create<ResultsState>() (
	persist(
		(set, get) => ({
			results: [],

			setResults: (gameEndStats: GameEndStatsTransmit) => {
				const { gameSeats } = useGameStore.getState();
				const currentResults = get().results;

				const isFirstRound = currentResults.length === 0 || currentResults.some(r => r.rank === undefined);

				const combined = gameSeats.map((uuid) => {
					const playerUuid = uuid ?? "";
					const cards = gameEndStats.playerFinalCardAmounts[playerUuid] ?? 0;

					const existingPlayer = currentResults.find(r => r.uuid === playerUuid);
					let wins = existingPlayer ? existingPlayer.totalWins : 0;

					if (playerUuid === gameEndStats.winnerPlayerUuid) {
						wins += 1;
					}

					const roundPoints = gameEndStats.playerPenaltyPoints[playerUuid];
					const previousTotalPoints = existingPlayer ? existingPlayer.totalPoints : 0;
					const totalPoints = previousTotalPoints + roundPoints;
					
					return {
						uuid: playerUuid,
						cards,
						totalWins: wins,
						points: roundPoints,
						totalPoints,
						existingPlayer,
					};
				}).filter(item => item.uuid !== "");

				combined.sort((a, b) => a.totalPoints - b.totalPoints);

				const newResults: ResultsItem[] = combined.map((item, index) => {
					const currentRank = index;
					let rankChanged = 0;
					if (isFirstRound) {
						rankChanged = currentRank === 0 ? 0 : -1;
					} else if (item.existingPlayer && item.existingPlayer.rank !== undefined) {
						const previousRank = item.existingPlayer.rank;

						if (currentRank < previousRank)
							rankChanged = 1;
						else if (currentRank > previousRank)
							rankChanged = -1;
						else
							rankChanged = 0;
					}

					return {
						uuid: item.uuid,
						points: item.points,
						totalPoints: item.totalPoints,
						totalWins: item.totalWins,
						rank: currentRank,
						rankChanged: rankChanged,
					}
				});

				set({
					results: newResults,
				});
			},

			resetResults: () => {
				set({ results: [] });
				useGameStore.setState({
					gameStarted: false,
					cardsLeft: [],
					currentHand: "None",
					round: 0,
					seatRef: [],
					activeSeat: 0,
				});
			},

			getLeaderboard: () => {
				return [...get().results].sort((a, b) => a.totalPoints - b.totalPoints);
			}
		}),
		{
			name: 'results-storage',
		}
	)
)