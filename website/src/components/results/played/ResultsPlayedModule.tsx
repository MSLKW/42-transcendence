import { useGameStore } from "../../../store/GameStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useResultsStore } from "../../../store/ResultsStore";
import { AvatarImage } from "../../avatar/image/AvatarImage";

export const ResultsPlayedModule = () => {
	const { totalPlayers, round } = useGameStore();
	const { getMemberData } = usePartyStore();
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
					border-t border-r border-n2/40
				"
			>
				<h2>Rounds Played: {round}</h2>
			</div>
			{ totalPlayers >= 1 && leaderboard[0] &&
				<div
					className={`
						row-start-2 row-end-2
						flex place-items-center
						gap-5
						h-full w-full
						border-r border-n2/40
						${clientUuid === leaderboard[0].uuid ? "bg-b2" : ""}
					`}
				>
					<AvatarImage />
					<div className="flex flex-col place-content-center place-items-start">
						<h3>{getMemberData(leaderboard[0].uuid)?.name}</h3>
						<p>Total Wins: {leaderboard[0].totalWins}</p>
					</div>
				</div>
			}
			{ totalPlayers >= 2 && leaderboard[1] &&
				<div
					className={`
						row-start-3 row-end-3
						flex place-items-center
						gap-5
						h-full w-full
						border-r border-n2/40
						${clientUuid === leaderboard[1].uuid ? "bg-b2" : ""}
					`}
				>
					<AvatarImage />
					<div className="flex flex-col place-content-center place-items-start">
						<h3>{getMemberData(leaderboard[1].uuid)?.name}</h3>
						<p>Total Wins: {leaderboard[1].totalWins}</p>
					</div>
				</div>
			}
			{ totalPlayers >= 3 && leaderboard[2] &&
				<div
					className={`
						row-start-4 row-end-4
						flex place-items-center
						gap-5
						h-full w-full
						border-r border-n2/40
						${clientUuid === leaderboard[2].uuid ? "bg-b2" : ""}
					`}
				>
					<AvatarImage />
					<div className="flex flex-col place-content-center place-items-start">
						<h3>{getMemberData(leaderboard[2].uuid)?.name}</h3>
						<p>Total Wins: {leaderboard[2].totalWins}</p>
					</div>
				</div>
			}
			{ totalPlayers >= 4 && leaderboard[3] &&
				<div
					className={`
						row-start-5 row-end-5
						flex place-items-center
						gap-5
						h-full w-full
						border-r border-n2/40
						${clientUuid === leaderboard[3].uuid ? "bg-b2" : ""}
					`}
				>
					<AvatarImage />
					<div className="flex flex-col place-content-center place-items-start">
						<h3>{getMemberData(leaderboard[3].uuid)?.name}</h3>
						<p>Total Wins: {leaderboard[3].totalWins}</p>
					</div>
				</div>
			}
		</>
	);
}