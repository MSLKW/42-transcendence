import { useGameStore } from "../../store/GameStore";
import { usePartyStore } from "../../store/PartyStore";
import { Window } from "../window/Window";
import { ResultsChangeModule } from "./change/ResultsChangeModule";
import { ResultsPodiumModule } from "./podium/ResultsPodiumModule";
import { ResultsRankModule } from "./rank/ResultsRankModule";
import { ResultsPlayedModule } from "./played/ResultsPlayedModule";
import { ResultsTotalModule } from "./total/ResultsTotalModule";
import { useResultsStore } from "../../store/ResultsStore";

export const ResultsWindow = () => {
	const { round } = useGameStore();
	const { endGame, startGame } = useGameStore();
	const { getMemberData } = usePartyStore();
	const { getLeaderboard } = useResultsStore();

	const leaderboard = getLeaderboard();
	const topPlayer = leaderboard[0];
	const playerName = topPlayer ? getMemberData(topPlayer.uuid)?.name : "Winner";
	const winner = `Congratulations ${playerName ?? "Player"}!`;
	// const winner = "Congratulations Player";

	return (
		<Window
			title={`Results of Round ${round}`}
			dismissKey="results"
		>
			<div
				className="
					py-3rem px-3rem
					max-h-[85vh] overflow-y-scroll pointer-events-auto
				"
			>
				<div
					className="
						flex flex-col
						gap-3rem
						pb-5
					"
				>
					<div
						className="
							flex flex-col
							place-content-center place-items-center
							gap-1rem
						"
					>
						<h3 className="text-n6">{winner}</h3>
						<div className="flex gap-2rem">
							<button
								onClick={endGame}
								className="
									h-3rem aspect-6/1
									btn-text bg-light
								"
							>
								End Game
							</button>
							<button
								onClick={startGame}
								className="
									h-3rem aspect-6/1
									btn-text bg-light
								"
							>
								Play Next Round
							</button>
						</div>
					</div>
					<ResultsPodiumModule />
				</div>
				<div
					className="
						grid grid-cols-[7.5rem_15rem_7.5rem_7.5rem] grid-rows-[5rem]
						text-center text-n6 space-y-5
					"
				>
					<ResultsRankModule />
					<ResultsPlayedModule />
					<ResultsChangeModule />
					<ResultsTotalModule />
				</div>
			</div>
		</Window>
	);
};