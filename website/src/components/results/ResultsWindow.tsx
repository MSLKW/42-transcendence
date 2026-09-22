import { useGameStore } from "../../store/GameStore";
import { Window } from "../window/Window";
import { ResultsChangeModule } from "./change/ResultsChangeModule";
import { ResultsPodiumModule } from "./podium/ResultsPodiumModule";
import { ResultsRankModule } from "./rank/ResultsRankModule";
import { ResultsPlayedModule } from "./played/ResultsPlayedModule";
import { ResultsTotalModule } from "./total/ResultsTotalModule";
import { useResultsStore } from "../../store/ResultsStore";
import { useProfileStore } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";

export const ResultsWindow = () => {
	const round = useGameStore((store) => store.round);
	const endGame = useGameStore((store) => store.endGame);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);
	const cachedData = useProfileStore((store) => store.cachedData);
	const getLeaderboard = useResultsStore((store) => store.getLeaderboard);

	const leaderboard = getLeaderboard();
	const topPlayer = leaderboard[0];
	const playerName = topPlayer ? cachedData[topPlayer.uuid ?? ""]?.name : "N/A";
	const winner = `Congratulations ${playerName ?? "Winner"}!`;

	return (
		<Window
			title={`Results of Round ${round}`}
			dismissKey="results"
			hasPinButton={false}
		>
			<div
				className="
					py-2rem px-3rem
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
						<h2 className="text-n6">{winner}</h2>
						<div className="flex gap-2rem">
							<button
								onClick={endGame}
								className="
									h-3rem aspect-6/1
									btn-text bg-light
								"
							>
								Leave Game
							</button>
							<button
								onClick={() => {setShowWindow("results", false)}}
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
						grid grid-cols-[6rem_15rem_6rem_6rem] grid-rows-[4rem]
						text-center text-n6 
						bg-n0/20 rounded-xl border border-n1/60
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