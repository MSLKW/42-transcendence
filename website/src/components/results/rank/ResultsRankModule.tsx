import { useGameStore } from "../../../store/GameStore";

export const ResultsRankModule = () => {
	const { seats, totalPlayers } = useGameStore();

	return (
		<>
			<div className="
				row-start-1 row-end-1
				flex place-content-center place-items-center
				h-full w-full
				border-t border-r border-n2/40
			">
				<h2>Rank</h2>
			</div>
			<div className="
				row-start-2 row-end-2
				flex place-content-center place-items-center
				h-full w-full
				bg-b2
				border-r border-n2/40 rounded-l-xl
			">
				<h3>1</h3>
			</div>
			{ totalPlayers >= 2 && seats[1] && 
				<div className="
					row-start-3 row-end-3
					flex place-content-center place-items-center
					h-full w-full
					border-r border-n2/40
				">
					<h3>2</h3>
				</div>
			}
			{ totalPlayers >= 3 && seats[2] && 
				<div className="
					row-start-4 row-end-4
					flex place-content-center place-items-center
					h-full w-full
					border-r border-n2/40
				">
					<h3>3</h3>
				</div>
			}
			{ totalPlayers >= 4 && seats[3] && 
				<div className="
					row-start-5 row-end-5
					flex place-content-center place-items-center
					h-full w-full
					border-r border-n2/40
				">
					<h3>4</h3>
				</div>
			}
		</>
	);
}