// import { useEffect } from "react";
import { useGameStore } from "../../store/GameStore";
import { useProfileStore } from "../../store/ProfileStore";
// import { useResultsStore } from "../../store/ResultsStore";
// import { useSceneStore } from "../../store/SceneStore";
// import { useAutoPass } from "../../utilities/react/useAutoPass";
import { HeaderModule } from "../header/HeaderModule";
import { AvatarModule } from "../avatar/AvatarModule";
import { RankCallButton } from "./rank/RankCallButton";
import { SortButtons } from "./sort/SortButton";
import { GamePassButton } from "./action/GamePassButton";
import { GamePlayButton } from "./action/GamePlayButton";

export const GameScene = () => {
	const totalPlayers = useGameStore((store) => store.totalPlayers);
	const gameSeats = useGameStore((store) => store.gameSeats);
	const seatRef = useGameStore((store) => store.seatRef);
	const cardsLeft = useGameStore((store) => store.cardsLeft);
	const activeSeat = useGameStore((store) => store.activeSeat);
	const gameStarted = useGameStore((store) => store.gameStarted);
	const cachedData = useProfileStore((store) => store.cachedData);
	// const setResults = useResultsStore((store) => store.setResults);
	// const setCurrentScene = useSceneStore((store) => store.setCurrentScene);
	// const setShowWindow = useSceneStore((store) => store.setShowWindow);

	// useAutoPass();
	// useEffect(() => {
	// 	if (cardsLeft.includes(0)) {
	// 		setResults();
	// 		setCurrentScene("Lobby");
	// 		setShowWindow("results", true);
	// 	}
	// }, [cardsLeft]);

	return (
		<>
			<HeaderModule back="Home" />
			<main>
				{ totalPlayers === 4 && gameSeats.length >= 4 &&
					<>
						<div className="absolute left-[4%] top-[20%]">
							{ gameSeats[seatRef[1]] &&
								<AvatarModule
									key={gameSeats[seatRef[1]] ?? ""}
									uuid={gameSeats[seatRef[1]] ?? ""}
									image={cachedData[gameSeats[seatRef[1]] ?? ""]?.avatar ?? undefined}
									cornerButton={cardsLeft[seatRef[1]] ?? -1}
									isActive={gameStarted && activeSeat === seatRef[1]}
								/>
							}
						</div>
						<div className="absolute left-[20%] top-[4%]">
							{ gameSeats[seatRef[2]] &&
								<AvatarModule
									key={gameSeats[seatRef[2]] ?? ""}
									uuid={gameSeats[seatRef[2]] ?? ""}
									image={cachedData[gameSeats[seatRef[2]] ?? ""]?.avatar ?? undefined}
									cornerButton={cardsLeft[seatRef[2]] ?? -1}
									isActive={gameStarted && activeSeat === seatRef[2]}
								/>
							}
						</div>
						<div className="absolute right-[4%] top-[20%]">
							{ gameSeats[seatRef[3]] &&
								<AvatarModule
									key={gameSeats[seatRef[3]] ?? ""}
									uuid={gameSeats[seatRef[3]] ?? ""}
									image={cachedData[gameSeats[seatRef[3]] ?? ""]?.avatar ?? undefined}
									cornerButton={cardsLeft[seatRef[3]] ?? -1}
									isActive={gameStarted && activeSeat === seatRef[3]}
								/>
							}
						</div>
					</>
				}
				{ totalPlayers === 3 && gameSeats.length >= 3 &&
					<>
						<div className="absolute left-[4%] top-[20%]">
							{ gameSeats[seatRef[1]] &&
								<AvatarModule
									key={gameSeats[seatRef[1]] ?? ""}
									uuid={gameSeats[seatRef[1]] ?? ""}
									image={cachedData[gameSeats[seatRef[1]] ?? ""]?.avatar ?? undefined}
									cornerButton={cardsLeft[seatRef[1]] ?? -1}
									isActive={gameStarted && activeSeat === seatRef[1]}
								/>
							}
						</div>
						<div className="absolute right-[4%] top-[20%]">
							{ gameSeats[seatRef[2]] &&
								<AvatarModule
									key={gameSeats[seatRef[2]] ?? ""}
									uuid={gameSeats[seatRef[2]] ?? ""}
									image={cachedData[gameSeats[seatRef[2]] ?? ""]?.avatar ?? undefined}
									cornerButton={cardsLeft[seatRef[2]] ?? -1}
									isActive={gameStarted && activeSeat === seatRef[2]}
								/>
							}
						</div>
					</>
				}
				{ totalPlayers === 2 && gameSeats.length >= 2 &&
					<div className="absolute left-[20%] top-[4%]">
						{ gameSeats[seatRef[1]] &&
							<AvatarModule
								key={gameSeats[seatRef[1]] ?? ""}
								uuid={gameSeats[seatRef[1]] ?? ""}
								image={cachedData[gameSeats[seatRef[1]] ?? ""]?.avatar ?? undefined}
								cornerButton={cardsLeft[seatRef[1]] ?? -1}
								isActive={gameStarted && activeSeat === seatRef[1]}
							/>
						}
					</div>
				}
				<div className="absolute left-1/2 top-[24%] -translate-x-1/2">
					<RankCallButton />
				</div>
				<div className="
					absolute left-1/2 top-[64%] -translate-x-1/2
					flex gap-2rem
				">
					<GamePassButton />
					<GamePlayButton />
				</div>
			</main>
			<footer className="flex place-content-between place-items-center">
				{ gameSeats[seatRef[0]] &&
					<AvatarModule
						key={gameSeats[seatRef[0]]}
						uuid={gameSeats[seatRef[0]] ?? ""}
						image={cachedData[gameSeats[seatRef[0]] ?? ""]?.avatar ?? undefined}
						cornerButton={cardsLeft[seatRef[0]]}
						isActive={gameStarted && activeSeat === seatRef[0]}
					/>
				}
				<div className="
					w-[clamp(1rem,10vw+0.5rem,5rem)] h-full
					flex flex-col place-content-between
					gap-0.5rem
				">
					<SortButtons />
				</div>
			</footer>
		</>
	);
}