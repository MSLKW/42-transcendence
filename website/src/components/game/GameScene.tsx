import { useEffect } from "react";
import { useGameStore } from "../../store/GameStore";
import { usePartyStore } from "../../store/PartyStore";
import { useResultsStore } from "../../store/ResultsStore";
import { useSceneStore } from "../../store/SceneStore";
import { useAutoPass } from "../../utilities/useAutoPass";
import { HeaderModule } from "../header/HeaderModule";
import { AvatarModule } from "../avatar/AvatarModule";
import { RankCallButton } from "./rank/RankCallButton";
import { SortButtons } from "./sort/SortButton";
import { GamePassButton } from "./action/GamePassButton";
import { GamePlayButton } from "./action/GamePlayButton";

export const GameScene = () => {
	const { totalPlayers, seats, seatRef, cardsLeft, activeSeat, gameStarted, setGameValue } = useGameStore();
	const { members } = usePartyStore();
	const { setResults } = useResultsStore();
	const { setCurrentScene, setShowWindow } = useSceneStore();

	useAutoPass();
	useEffect(() => {
		if (cardsLeft.includes(0)) {
			setGameValue("gameStarted", false);
			setResults();
			setCurrentScene("Lobby");
			setShowWindow("results", true);
		}
	}, [cardsLeft]);

	return (
		<>
			<HeaderModule back="Home" />
			<main>
				{ totalPlayers === 4 && members.length >= 4 &&
					<>
						<div className="absolute left-[5%] top-[20%]">
							{ seats[seatRef[1]] &&
								<AvatarModule
									key={seats[seatRef[1]] ?? ""}
									uuid={seats[seatRef[1]] ?? ""}
									cornerButton={cardsLeft[seatRef[1]] ?? -1}
									isActive={gameStarted && activeSeat === seatRef[1]}
								/>
							}
						</div>
						<div className="absolute left-[25%] top-[5%]">
							{ seats[seatRef[2]] &&
								<AvatarModule
									key={seats[seatRef[2]] ?? ""}
									uuid={seats[seatRef[2]] ?? ""}
									cornerButton={cardsLeft[seatRef[2]] ?? -1}
									isActive={gameStarted && activeSeat === seatRef[2]}
								/>
							}
						</div>
						<div className="absolute right-[5%] top-[20%]">
							{ seats[seatRef[3]] &&
								<AvatarModule
									key={seats[seatRef[3]] ?? ""}
									uuid={seats[seatRef[3]] ?? ""}
									cornerButton={cardsLeft[seatRef[3]] ?? -1}
									isActive={gameStarted && activeSeat === seatRef[3]}
								/>
							}
						</div>
					</>
				}
				{ totalPlayers === 3 && members.length >= 3 &&
					<>
						<div className="absolute left-[5%] top-[20%]">
							{ seats[seatRef[1]] &&
								<AvatarModule
									key={seats[seatRef[1]] ?? ""}
									uuid={seats[seatRef[1]] ?? ""}
									cornerButton={cardsLeft[seatRef[1]] ?? -1}
									isActive={gameStarted && activeSeat === seatRef[1]}
								/>
							}
						</div>
						<div className="absolute right-[5%] top-[20%]">
							{ seats[seatRef[2]] &&
								<AvatarModule
									key={seats[seatRef[2]] ?? ""}
									uuid={seats[seatRef[2]] ?? ""}
									cornerButton={cardsLeft[seatRef[2]] ?? -1}
									isActive={gameStarted && activeSeat === seatRef[2]}
								/>
							}
						</div>
					</>
				}
				{ totalPlayers === 2 && members.length >= 2 &&
					<div className="absolute left-[25%] top-[5%]">
						{ seats[seatRef[1]] &&
							<AvatarModule
								key={seats[seatRef[1]] ?? ""}
								uuid={seats[seatRef[1]] ?? ""}
								cornerButton={cardsLeft[seatRef[1]] ?? -1}
								isActive={gameStarted && activeSeat === seatRef[1]}
							/>
						}
					</div>
				}
				<div className="absolute left-1/2 top-[32.5%] -translate-x-1/2">
					<RankCallButton />
				</div>
				<div
					className="
						absolute left-1/2 top-[65%] -translate-x-1/2
						flex gap-2rem
					"
				>
					<GamePassButton />
					<GamePlayButton />
				</div>
			</main>
			<footer className="flex place-content-between place-items-center">
				{ seats[seatRef[0]] &&
					<AvatarModule
						key={seats[seatRef[0]]}
						uuid={seats[seatRef[0]] ?? ""}
						cornerButton={cardsLeft[seatRef[0]]}
						isActive={gameStarted && activeSeat === seatRef[0]}
					/>
				}
				<div
					className="
						w-[clamp(1rem,10vw+0.5rem,5rem)] h-full
						flex flex-col place-content-between
						gap-0.5rem
					"
				>
					<SortButtons />
				</div>
			</footer>
		</>
	);
}