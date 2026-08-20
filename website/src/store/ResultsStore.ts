import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGameStore } from "./GameStore";

interface ResultsItem {
	uuid: string,
	points: number,
	totalPoints: number,
	totalWins: number,
	rank: number,
	rankChanged: number,
}

interface ResultsValues {
	results: ResultsItem[],
};

interface ResultsState extends ResultsValues {
	setResults: () => void,
	resetResults: () => void,
	getLeaderboard: () => ResultsItem[];
};

export const useResultsStore = create<ResultsState>() (
	persist(
		(set, get) => ({
			results: [],

			setResults: () => {
				const { seats, cardsLeft } = useGameStore.getState();
				const currentResults = get().results;

				const isFirstRound = currentResults.length === 0 || currentResults.some(r => r.rank === undefined);

				const combined = seats.map((uuid, index) => {
					const playerUuid = uuid ?? "";
					const cards = cardsLeft[index] ?? 0;

					const existingPlayer = currentResults.find(r => r.uuid === playerUuid);
					let wins = existingPlayer ? existingPlayer.totalWins : 0;

					if (cards === 0 && playerUuid !== "")
						wins += 1;

					return {
						uuid: playerUuid,
						cards,
						totalWins: wins,
						existingPlayer,
					};
				}).filter(item => item.uuid !== "");

				combined.sort((a, b) => a.cards - b.cards);

				const newResults: ResultsItem[] = combined.map((item, index) => {
					const currentRank = index;
					const roundPoints = item.cards;
					const previousTotalPoints = item.existingPlayer ? item.existingPlayer.totalPoints : 0;

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
						points: roundPoints,
						totalPoints: previousTotalPoints + roundPoints,
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
				set({
					results: [],
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