
import { useGameStore } from "../../../store/GameStore";
import { RedTriangle } from "../triangle/RedTriangle";
import { GreenTriangle } from "../triangle/GreenTriangle";
import { useProfileStore } from "../../../store/ProfileStore";
import { useResultsStore } from "../../../store/ResultsStore";

export const ResultsChangeModule = () => {
	const { totalPlayers } = useGameStore();
	const { clientUuid } = useProfileStore();
	const { getLeaderboard } = useResultsStore();
	const leaderboard = getLeaderboard();
	
	return (
		<>
			<div
				className="
					row-start-1 row-end-1
					flex place-content-center place-items-center
					h-full w-full
					bg-n0/20 border-r border-n0/20
				"
			>
				<h3>Change</h3>
			</div>
			{ totalPlayers >= 1 && leaderboard[0] &&
				<div
					className={`
						row-start-2 row-end-2
						flex place-content-center place-items-center
						h-full w-full
						border-r border-n0/20
						${clientUuid === leaderboard[0].uuid ? "bg-b2" : ""}
					`}
				>
					{
						leaderboard[0].rankChanged === 1 ? <GreenTriangle /> :
						leaderboard[0].rankChanged === -1 ? <RedTriangle /> :
						"-"
					}
				</div>
			}
			{ totalPlayers >= 2 && leaderboard[1] &&
				<div
					className={`
						row-start-3 row-end-3
						flex place-content-center place-items-center
						h-full w-full
						border-r border-n0/20
						${clientUuid === leaderboard[1].uuid ? "bg-b2" : ""}
					`}
				>
					{
						leaderboard[1].rankChanged === 1 ? <GreenTriangle /> :
						leaderboard[1].rankChanged === -1 ? <RedTriangle /> :
						"-"
					}
				</div>
			}
			{ totalPlayers >= 3 && leaderboard[2] &&
				<div
					className={`
						row-start-4 row-end-4
						flex place-content-center place-items-center
						h-full w-full
						border-r border-n0/20
						${clientUuid === leaderboard[2].uuid ? "bg-b2" : ""}
					`}
				>
					{
						leaderboard[2].rankChanged === 1 ? <GreenTriangle /> :
						leaderboard[2].rankChanged === -1 ? <RedTriangle /> :
						"-"
					}
				</div>
			}
			{ totalPlayers >= 4 && leaderboard[3] &&
				<div
					className={`
						row-start-5 row-end-5
						flex place-content-center place-items-center
						h-full w-full
						border-r border-n0/20
						${clientUuid === leaderboard[3].uuid ? "bg-b2" : ""}
					`}
				>
					{
						leaderboard[3].rankChanged === 1 ? <GreenTriangle /> :
						leaderboard[3].rankChanged === -1 ? <RedTriangle /> :
						"-"
					}
				</div>
			}
		</>
	);
}