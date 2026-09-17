import { useEffect } from "react";
import { useGameStore } from "../../store/GameStore";
import { useProfileStore } from "../../store/ProfileStore";
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
	const { totalPlayers, seats, seatRef, cardsLeft, activeSeat, gameStarted } = useGameStore();
	const { getCachedData } = useProfileStore();

	// console.log(`GameScene Seats: ${seats}`);
	// console.log(seatRef);
	// console.log(totalPlayers);

	return (
		<>
			<HeaderModule back="Home" />
			<main>
				{ totalPlayers === 4 && seats.length >= 4 &&
					<>
						<div className="absolute left-[4%] top-[20%]">
							{ seats[seatRef[1]] &&
								<AvatarModule
									key={seats[seatRef[1]] ?? ""}
									uuid={seats[seatRef[1]] ?? ""}
									image={getCachedData(seats[seatRef[1]])?.avatar ?? "avatar-unknown.webp"}
									cornerButton={cardsLeft[seatRef[1]] ?? -1}
									isActive={gameStarted && activeSeat === seatRef[1]}
								/>
							}
						</div>
						<div className="absolute left-[20%] top-[4%]">
							{ seats[seatRef[2]] &&
								<AvatarModule
									key={seats[seatRef[2]] ?? ""}
									uuid={seats[seatRef[2]] ?? ""}
									image={getCachedData(seats[seatRef[2]])?.avatar ?? "avatar-unknown.webp"}
									cornerButton={cardsLeft[seatRef[2]] ?? -1}
									isActive={gameStarted && activeSeat === seatRef[2]}
								/>
							}
						</div>
						<div className="absolute right-[4%] top-[20%]">
							{ seats[seatRef[3]] &&
								<AvatarModule
									key={seats[seatRef[3]] ?? ""}
									uuid={seats[seatRef[3]] ?? ""}
									image={getCachedData(seats[seatRef[3]])?.avatar ?? "avatar-unknown.webp"}
									cornerButton={cardsLeft[seatRef[3]] ?? -1}
									isActive={gameStarted && activeSeat === seatRef[3]}
								/>
							}
						</div>
					</>
				}
				{ totalPlayers === 3 && seats.length >= 3 &&
					<>
						<div className="absolute left-[4%] top-[20%]">
							{ seats[seatRef[1]] &&
								<AvatarModule
									key={seats[seatRef[1]] ?? ""}
									uuid={seats[seatRef[1]] ?? ""}
									image={getCachedData(seats[seatRef[1]])?.avatar ?? "avatar-unknown.webp"}
									cornerButton={cardsLeft[seatRef[1]] ?? -1}
									isActive={gameStarted && activeSeat === seatRef[1]}
								/>
							}
						</div>
						<div className="absolute right-[4%] top-[20%]">
							{ seats[seatRef[2]] &&
								<AvatarModule
									key={seats[seatRef[2]] ?? ""}
									uuid={seats[seatRef[2]] ?? ""}
									image={getCachedData(seats[seatRef[2]])?.avatar ?? "avatar-unknown.webp"}
									cornerButton={cardsLeft[seatRef[2]] ?? -1}
									isActive={gameStarted && activeSeat === seatRef[2]}
								/>
							}
						</div>
					</>
				}
				{ totalPlayers === 2 && seats.length >= 2 &&
					<div className="absolute left-[20%] top-[4%]">
						{ seats[seatRef[1]] &&
							<AvatarModule
								key={seats[seatRef[1]] ?? ""}
								uuid={seats[seatRef[1]] ?? ""}
								image={getCachedData(seats[seatRef[1]])?.avatar ?? "avatar-unknown.webp"}
								cornerButton={cardsLeft[seatRef[1]] ?? -1}
								isActive={gameStarted && activeSeat === seatRef[1]}
							/>
						}
					</div>
				}
				<div className="absolute left-1/2 top-[24%] -translate-x-1/2">
					<RankCallButton />
				</div>
				<div
					className="
						absolute left-1/2 top-[64%] -translate-x-1/2
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
						image={getCachedData(seats[seatRef[0]])?.avatar ?? "avatar-unknown.webp"}
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