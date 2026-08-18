import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ResultsItem {
	rank: number,
	pointsDiff: number,
	totalPoints: number,
	totalWins: number,
	changeRank: number[],
}

interface ResultsValues {
	uuidRank: string[],
	results: ResultsItem[],
};

interface ResultsState extends ResultsValues {

};

export const useResultsStore = create<ResultsState>() (
	persist(
		(set, get) => ({
			uuidRank: [],
			results: [],
		}),
		{
			name: 'results-storage',
		}
	)
)