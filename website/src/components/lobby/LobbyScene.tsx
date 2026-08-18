import { useEffect } from "react";
import { useBotStore } from "../../store/BotStore";
import { useGameStore } from "../../store/GameStore"; 
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { HeaderModule } from "../header/HeaderModule";
import { AvatarModule } from "../avatar/AvatarModule";
import { PartyCallButton } from "../party/call/PartyCallButton";
import { BotManagerButton } from "./bots/BotManagerButton";
import { HostSettings } from "./host_settings/HostSettings";
import { TakeSeatButton } from "./take_seat/TakeSeatButton";
import { UnseatButton } from "./unseat/UnseatButton";
import { ResultsCallButton } from "../results/call/ResultsCallButton";

export const LobbyScene = () => {
	const { fillSeatsWithBots } = useBotStore();
	const { totalPlayers, seats, startGame, round } = useGameStore();
	const { members, humans, hostUuid } = usePartyStore();
	const { clientUuid } = useProfileStore();
	const { setCurrentScene } = useSceneStore();

	useEffect(() => {
		const humansSeated = seats.filter((seat): seat is string => seat !== null && !seats.includes("bot")).length;
		const totalSeated = seats.filter((seat): seat is string => seat !== null).length;

		if (totalSeated === members.length && humansSeated > 0) {
			fillSeatsWithBots();
			return;
		}
	}, []);

	const handleStart = () => {
		setCurrentScene("Game");
		startGame();
	}

	const seatsFilled = totalPlayers === seats.filter((seat): seat is string => seat !== null).length;

	return (
		<>
			<HeaderModule back="Home"/>
			<main className="flex">
				<div className="flex place-items-center">
					<HostSettings />
				</div>
				<div className="w-full flex flex-col place-content-evenly">
					<div className={`
						h-full
						grid ${ totalPlayers === 3 ? "grid-cols-2" : "grid-cols-1" } grid-rows-1
						place-content-evenly place-items-center
					`}>
						{ totalPlayers === 4 &&
							( seats[2]
								? <AvatarModule key={seats[2]} uuid={seats[2]} cornerButton={seats[2] === hostUuid ? "host" : ""}/>
								: <TakeSeatButton uuid={clientUuid!} seatNumber={2}/>
							)
						}
						{ totalPlayers === 3 &&
							<>
								{ seats[1]
									? <AvatarModule key={seats[1]} uuid={seats[1]} cornerButton={seats[1] === hostUuid ? "host" : ""}/>
									: <TakeSeatButton uuid={clientUuid!} seatNumber={1}/>
								}
								{ seats[2]
									? <AvatarModule key={seats[2]} uuid={seats[2]} cornerButton={seats[2] === hostUuid ? "host" : ""}/>
									: <TakeSeatButton uuid={clientUuid!} seatNumber={2}/>
								}
							</>
						}
						{ totalPlayers === 2 &&
							( seats[1]
								? <AvatarModule key={seats[1]} uuid={seats[1]} cornerButton={seats[1] === hostUuid ? "host" : ""}/>
								: <TakeSeatButton uuid={clientUuid!} seatNumber={1}/>
							)
						}
					</div>
					<div
						className={`
							w-full h-full
							flex
							place-items-center place-content-evenly
						`}
					>
						{ totalPlayers === 4 &&
							( seats[1]
								? <AvatarModule key={seats[1]} uuid={seats[1]} cornerButton={seats[1] === hostUuid ? "host" : ""}/>
								: <TakeSeatButton uuid={clientUuid!} seatNumber={1}/>
							)
						}
						<button
							data-tip={seatsFilled ? "Let's Play!" : "Waiting for seats to be filled"}
							disabled={!seatsFilled}
							onClick={handleStart}
							className="
								btn-text bg-light
								h-3rem aspect-5/1
								text-1.25rem text-n0
								data-tip-up
							"
						>
							START
						</button>
						{ totalPlayers === 4 &&
							( seats[3]
								? <AvatarModule key={seats[3]} uuid={seats[3]} cornerButton={seats[3] === hostUuid ? "host" : ""}/>
								: <TakeSeatButton uuid={clientUuid!} seatNumber={3}/>
								)
								}
					</div>
					<div className="w-full h-full grid place-items-center place-content-center">
						{ seats[0]
							? <AvatarModule key={seats[0]} uuid={seats[0]} cornerButton={seats[0] === hostUuid ? "host" : ""} />
							: <TakeSeatButton uuid={clientUuid!} seatNumber={0}/>
						}
					</div>
				</div>
			</main>
			<footer
				className="
					pointer-events-auto
					flex place-content-between place-items-center
					relative
				"
			>
				<div
					tabIndex={-1}
					className="
						w-full
						flex
						gap-2rem
						sm:overflow-x-visible overflow-x-auto
					"
				>
					{ members.map((member) => (
						member.uuid && !seats.includes(member.uuid) &&
							<AvatarModule
								key={member.uuid}
								uuid={member.uuid}
								cornerButton={member.uuid === hostUuid ? "host" : ""}
							/>
					))}
					<PartyCallButton />
				</div>
				<div className="flex gap-2rem">
					{ seats.includes(clientUuid) && humans > 1 && <UnseatButton uuid={clientUuid!} /> }
					<BotManagerButton />
					{ round > 1 && <ResultsCallButton /> }
				</div>
			</footer>
		</>
	);
}