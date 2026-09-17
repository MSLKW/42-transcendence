import { useGameStore } from "../../../store/GameStore";
import { useAuthStore } from "../../../store/AuthStore";
import { useResultsStore } from "../../../store/ResultsStore";

export const ResultsTotalModule = () => {
	const totalPlayers = useGameStore((store) => store.totalPlayers);
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const getLeaderboard = useResultsStore((store) => store.getLeaderboard);

	const leaderboard = getLeaderboard();

	return (
		<>
			<div
				className="
					row-start-1 row-end-1
					flex place-content-center place-items-center
					h-full w-full
					bg-n0/20 rounded-r-xl
				"
			>
				<h3>Total</h3>
			</div>
			{ totalPlayers >= 1 && leaderboard[0] &&
				<div
					className={`
						row-start-2 row-end-2
						flex place-content-center place-items-center
						h-full w-full
						rounded-r-xl
						${clientUuid === leaderboard[0].uuid ? "bg-b2" : ""}
					`}
				>
					<h3>{leaderboard[0].totalPoints}</h3>
				</div>
			}
			{ totalPlayers >= 2 && leaderboard[1] &&
				<div
					className={`
						row-start-3 row-end-3
						flex place-content-center place-items-center
						h-full w-full
						rounded-r-xl
						${clientUuid === leaderboard[1].uuid ? "bg-b2" : ""}
					`}
				>
					<h3>{leaderboard[1].totalPoints}</h3>
				</div>
			}
			{ totalPlayers >= 3 && leaderboard[2] &&
				<div
					className={`
						row-start-4 row-end-4
						flex place-content-center place-items-center
						h-full w-full
						rounded-r-xl
						${clientUuid === leaderboard[2].uuid ? "bg-b2" : ""}
					`}
				>
					<h3>{leaderboard[2].totalPoints}</h3>
				</div>
			}
			{ totalPlayers >= 4 && leaderboard[3] &&
				<div
					className={`
						row-start-5 row-end-5
						flex place-content-center place-items-center
						h-full w-full
						rounded-r-xl
						${clientUuid === leaderboard[3].uuid ? "bg-b2" : ""}
					`}
				>
					<h3>{leaderboard[3].totalPoints}</h3>
				</div>
			}
		</>
	);
}