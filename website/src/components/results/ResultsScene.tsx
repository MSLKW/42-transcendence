import { useGameStore } from "../../store/GameStore";
import { usePartyStore } from "../../store/PartyStore";
import { useSceneStore } from "../../store/SceneStore";
import { HeaderModule } from "../header/HeaderModule";
import { ResultsChangeModule } from "./change/ResultsChangeModule";
import { ResultsPodiumModule } from "./podium/ResultsPodiumModule";
import { ResultsRankModule } from "./rank/ResultsRankModule";
import { ResultsRoundModule } from "./round/ResultsRoundModule";
import { ResultsTotalModule } from "./total/ResultsTotalModule";

export const ResultsScene = () => {
	const { endGame, startGame } = useGameStore();
	const { members } = usePartyStore();
	const { setCurrentScene } = useSceneStore();
	const handleEndGame = () => {
		endGame();
		setCurrentScene("Home");
	}
	const handlePlayNext = () => {
		startGame();
		setCurrentScene("Game");
	}
	const winner = "Congratulations " + members[0].name + "! Play next round?";
	
	return (
		<>
			<HeaderModule back="Lobby" />
			<main
				className="
					flex place-content-center place-items-center
					py-2rem px-3rem
				"
			>
				<div
					className="
						bg-dark
						rounded-xl
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
									onClick={handleEndGame}
									className="
										h-3rem aspect-5/1
										btn-text bg-light
									"
								>
									End
								</button>
								<button
									onClick={handlePlayNext}
									className="
										h-3rem aspect-5/1
										btn-text bg-light
									"
								>
									Let's Go!
								</button>
							</div>
						</div>
						<ResultsPodiumModule />
					</div>
					<div
						className="
							grid grid-cols-[7.5rem_15rem_7.5rem_7.5rem] grid-rows-[5rem]
							text-center text-n6
						"
					>
						<ResultsRankModule />
						<ResultsRoundModule />
						<ResultsChangeModule />
						<ResultsTotalModule />
					</div>
				</div>
			</main>
		</>
	);
}