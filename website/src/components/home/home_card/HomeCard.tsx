import { partySocket } from "../../../api/party/partySocket";
import { handleValidate } from "../../../api/authentication/validate/handleValidate";
import { useGameStore, type GAMEMODE_TYPE } from "../../../store/GameStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useAuthStore } from "../../../store/AuthStore";
import { useSceneStore } from "../../../store/SceneStore";
import { PersonIcon } from "./person/PersonIcon";
import { TutorialIcon } from "./tutorial/TutorialIcon";

interface HomeProps {
	gameMode: GAMEMODE_TYPE;
	playerCount: number;
}

export const HomeCardButton = ({ gameMode, playerCount }: HomeProps) => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const autoSetSeats = useGameStore((store) => store.autoSetSeats);
	const initSeats = useGameStore((store) => store.initSeats);
	const setCurrentScene = useSceneStore((store) => store.setCurrentScene);
	const hostUuid = usePartyStore((store) => store.hostUuid);
	const members = usePartyStore((store) => store.members);

	const handleCardClick = () => {
		handleValidate();

		useGameStore.setState({ totalPlayers: playerCount });
		if (members.length <= 1)
			autoSetSeats();
		else
			initSeats();

		if (gameMode === "Tutorial")
			setCurrentScene("Test");
		else
			setCurrentScene("Lobby");
		partySocket.startGameSession();
	};

	return (
		<button
			data-tip="Host is in control"
			disabled={clientUuid !== hostUuid}
			onClick={handleCardClick}
			className={`
				h-full max-h-150 aspect-2/3
				bg-linear-to-b from-b3 to-b5 hover:not-disabled:from-b4 hover:not-disabled:to-b5
				border border-b6 rounded-[clamp(0.375rem,3.462vmin-0.663rem,1.5rem)]
				p-[clamp(1.25rem,1.786vmin+0.893rem,2.5rem)]
				flex flex-col place-content-between
				hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
				focus-visible:outline-2 outline-b5 outline-offset-5
				${clientUuid === hostUuid ? "cursor-pointer" : ""}
				snap-center
				${clientUuid === hostUuid ? "" : "data-tip-up"}
			`}
		>
			{ gameMode === "4 Players" &&
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
			{ gameMode === "3 Players" &&
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
			{ gameMode === "2 Players" &&
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
			{ gameMode === "Tutorial" &&
				<>
					<div className="
						h-[clamp(2.5rem,3.571vmin+1.786rem,5rem)] aspect-square w-max
					">
						<TutorialIcon />
					</div>
					<h1 className="text-n0">Tutorial</h1>
				</>
			}
		</button>
	);
}