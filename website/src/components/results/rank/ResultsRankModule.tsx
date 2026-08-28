import { useGameStore } from "../../../store/GameStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useResultsStore } from "../../../store/ResultsStore";

export const ResultsRankModule = () => {
	const { totalPlayers } = useGameStore();
	const { clientUuid } = useProfileStore();
	const { getLeaderboard } = useResultsStore();
	const leaderboard = getLeaderboard();

	return (
		<>
			<div
				className={`
					row-start-1 row-end-1
					flex place-content-center place-items-center
					h-full w-full
					bg-n0/20 rounded-l-xl border-r border-n0/20
				`}
			>
				<h3>Rank</h3>
			</div>
			{ totalPlayers >= 1 && leaderboard[0] && 
				<div
					className={`
						row-start-2 row-end-2
						flex place-content-center place-items-center
						h-full w-full
						border-n0/20 rounded-l-xl
						${clientUuid === leaderboard[0].uuid ? "bg-b2" : "border-r"}
					`}
				>
					<h3>1</h3>
				</div>
			}
			{ totalPlayers >= 2 && leaderboard[1] && 
				<div
					className={`
						row-start-3 row-end-3
						flex place-content-center place-items-center
						h-full w-full
						border-n0/20 rounded-l-xl
						${clientUuid === leaderboard[1].uuid ? "bg-b2" : "border-r"}
					`}
				>
					<h3>2</h3>
				</div>
			}
			{ totalPlayers >= 3 && leaderboard[2] && 
				<div
					className={`
						row-start-4 row-end-4
						flex place-content-center place-items-center
						h-full w-full
						border-n0/20 rounded-l-xl
						${clientUuid === leaderboard[2].uuid ? "bg-b2" : "border-r"}
					`}
				>
					<h3>3</h3>
				</div>
			}
			{ totalPlayers >= 4 && leaderboard[3] && 
				<div
					className={`
						row-start-5 row-end-5
						flex place-content-center place-items-center
						h-full w-full
						border-n0/20 rounded-l-xl
						${clientUuid === leaderboard[3].uuid ? "bg-b2" : "border-r"}
					`}
				>
					<h3>4</h3>
				</div>
			}
		</>
	);
}