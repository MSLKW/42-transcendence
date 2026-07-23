import { useSceneStore } from "../../store/SceneStore";
import { useGameStore } from "../../store/GameStore";
import { GAMEMODE, type GameModeType, usePartyStore } from "../../store/PartyStore";
import { PersonIcon } from "../icon/Person";
import { TutorialIcon } from "../icon/TutorialIcon";

interface HomeProps {
	gameMode?: number;
}

export const HomeCardButton = ({ gameMode = 4 }: HomeProps) => {
	const { setCurrentScene } = useSceneStore();
	const { setGameValue } = useGameStore();
	const { setPartyValue } = usePartyStore();

	return (
		<button
			onClick={() => {
				setGameValue("totalPlayers", gameMode);
				setPartyValue("gameMode", gameMode as GameModeType);
				if (gameMode === GAMEMODE.TUTORIAL)
					setCurrentScene("GAMEPLAY")
				else
					setCurrentScene("LOBBY")
			}}
			className="
				h-full max-h-150 aspect-2/3
				bg-linear-to-b from-b3 to-b5 hover:not-disabled:from-b4 hover:not-disabled:to-b5
				border border-b6 rounded-[clamp(0.375rem,3.462vmin-0.663rem,1.5rem)]
				p-[clamp(1.25rem,1.786vmin+0.893rem,2.5rem)]
				flex flex-col place-content-between
				hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
				focus-visible:outline-2 outline-b5 outline-offset-5
				snap-center
		">
			{ gameMode === GAMEMODE.VERSUS4 &&
				<>
					<div className="
						w-[clamp(2.5rem,3.571vmin+1.786rem,5rem)] aspect-square
						grid grid-cols-auto grid-rows-auto
					">
						<div className="
							row-start-1 row-end-1
							col-start-1 col-end-1
							h-full aspect-square
						">
							<PersonIcon />
						</div>
						<div className="
							row-start-1 row-end-1
							col-start-3 col-end-3
							h-full aspect-square
						">
							<PersonIcon />
						</div>
						<div className="
							row-start-3 row-end-3
							col-start-1 col-end-1
							h-full aspect-square
						">
							<PersonIcon />
						</div>
						<div className="
							row-start-3 row-end-3
							col-start-3 col-end-3
							h-full aspect-square
						">
							<PersonIcon />
						</div>
					</div>
					<h1 className="text-n0">4 Players</h1>
				</>
			}
			{ gameMode === GAMEMODE.VERSUS3 &&
				<>
					<div className="
						w-[clamp(2.5rem,3.571vmin+1.786rem,5rem)] aspect-square
						grid grid-cols-3 grid-rows-auto
					">
						<div className="
							row-start-1 row-end-1
							col-start-1 col-end-1
							h-full aspect-square
						">
							<PersonIcon />
						</div>
						<div className="
							row-start-1 row-end-1
							col-start-3 col-end-3
							h-full aspect-square
						">
							<PersonIcon />
						</div>
						<div className="
							row-start-3 row-end-3
							col-start-2 col-end-2
							h-full aspect-square
						">
							<PersonIcon />
						</div>
					</div>
					<h1 className="text-n0">3 Players</h1>
				</>
			}
			{ gameMode === GAMEMODE.VERSUS2 &&
				<>
					<div className="
						h-[clamp(2.5rem,3.571vmin+1.786rem,5rem)] aspect-square w-max
						grid grid-cols-1 grid-rows-2
					">
						<div className="
							row-start-1 row-end-1
							col-start-2 col-end-2
							h-full aspect-square
						">
							<PersonIcon />
						</div>
						<div className="
							row-start-2 row-end-2
							col-start-1 col-end-1
							h-full aspect-square
						">
							<PersonIcon />
						</div>
					</div>
					<h1 className="text-n0">2 Players</h1>
				</>
			}
			{ gameMode === GAMEMODE.TUTORIAL &&
				<>
					<div className="
						w-[clamp(2.5rem,3.571vmin+1.786rem,5rem)] aspect-square
					">
						<TutorialIcon />
					</div>
					<h1 className="text-n0">Tutorial</h1>
				</>
			}
		</button>
	);
}