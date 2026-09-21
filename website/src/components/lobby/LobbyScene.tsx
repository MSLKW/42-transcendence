import { useEffect } from "react";
import { useAuthStore } from "../../store/AuthStore";
import { useBotStore } from "../../store/BotStore";
import { useGameStore } from "../../store/GameStore"; 
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";
import { useResultsStore } from "../../store/ResultsStore";
import { HeaderModule } from "../header/HeaderModule";
import { AvatarModule } from "../avatar/AvatarModule";
import { PartyCallButton } from "../party/call/PartyCallButton";
import { BotManagerButton } from "./bots/BotManagerButton";
import { HostSettings } from "./host_settings/HostSettings";
import { TakeSeatButton } from "./take_seat/TakeSeatButton";
import { UnseatButton } from "./unseat/UnseatButton";
import { ResultsCallButton } from "../results/call/ResultsCallButton";

export const LobbyScene = () => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	// const fillSeatsWithBots = useBotStore((store) => store.fillSeatsWithBots);
	const removeBots = useBotStore((store) => store.removeBots);
	const totalPlayers = useGameStore((store) => store.totalPlayers);
	const seats = useGameStore((store) => store.seats);
	const seatRef = useGameStore((store => store.seatRef));
	const startGame = useGameStore((store) => store.startGame);
	const round = useGameStore((store) => store.round);
	const members = usePartyStore((store) => store.members);
	const hostUuid = usePartyStore((store) => store.hostUuid);
	const cachedData = useProfileStore((store) => store.cachedData);
	const resetResults = useResultsStore((store) => store.resetResults);
	
	useEffect(() => {
		const humansSeated = seats.filter((seat): seat is string => seat !== null && !seat.includes("bot")).length;
		if (humansSeated === members.length) {
			// fillSeatsWithBots();
			return;
		}
		
		if (seats.includes(null)) {
			resetResults();
			removeBots();
		}
	}, [members, seats]);

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
								?
									<AvatarModule
										key={seats[2]}
										uuid={seats[2]}
										image={cachedData[seats[2]]?.avatar ?? undefined}
										cornerButton={seats[2] === hostUuid ? "host" : ""}
									/>
								: <TakeSeatButton seatNumber={2}/>
							)
						}
						{ totalPlayers === 3 &&
							<>
								{ seats[1]
									? 
										<AvatarModule
											key={seats[1]}
											uuid={seats[1]}
											image={cachedData[seats[1]]?.avatar ?? undefined}
											cornerButton={seats[1] === hostUuid ? "host" : ""}
										/>
									: <TakeSeatButton seatNumber={1}/>
								}
								{ seats[2]
									?
										<AvatarModule
											key={seats[2]}
											uuid={seats[2]}
											image={cachedData[seats[2]]?.avatar ?? undefined}
											cornerButton={seats[2] === hostUuid ? "host" : ""}
										/>
									: <TakeSeatButton seatNumber={2}/>
								}
							</>
						}
						{ totalPlayers === 2 &&
							( seats[1]
								?
									<AvatarModule
										key={seats[1]}
										uuid={seats[1]}
										image={cachedData[seats[1]]?.avatar ?? undefined}
										cornerButton={seats[1] === hostUuid ? "host" : ""}
									/>
								: <TakeSeatButton seatNumber={1}/>
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
								?
									<AvatarModule
										key={seats[1]}
										uuid={seats[1]}
										image={cachedData[seats[1]]?.avatar ?? undefined}
										cornerButton={seats[1] === hostUuid ? "host" : ""}
									/>
								: <TakeSeatButton seatNumber={1}/>
							)
						}
						<button
							data-tip={seatsFilled ? "Let's Play!" : "Waiting for seats to be filled"}
							disabled={!(seatsFilled && clientUuid === hostUuid)}
							onClick={startGame}
							className="
								btn-text bg-light
								h-3rem aspect-4/1
								text-1.25rem text-n0
								data-tip-up
							"
						>
							START
						</button>
						{ totalPlayers === 4 &&
							( seats[3]
								?
									<AvatarModule
										key={seats[3]}
										uuid={seats[3]}
										image={cachedData[seats[3]]?.avatar ?? undefined}
										cornerButton={seats[3] === hostUuid ? "host" : ""}
									/>
								: <TakeSeatButton seatNumber={3}/>
								)
								}
					</div>
					<div className="w-full h-full grid place-items-center place-content-center">
						{ seats[0]
							?
								<AvatarModule
									key={seats[0]}
									uuid={seats[0]}
									image={cachedData[seats[0]]?.avatar ?? undefined}
									cornerButton={seats[0] === hostUuid ? "host" : ""}
								/>
							: <TakeSeatButton seatNumber={0}/>
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
						gap-2rem pt-2rem
						sm:overflow-x-visible overflow-x-auto
					"
				>
					<PartyCallButton />
					{ members.map((uuid) => (
						uuid && !seats.includes(uuid) &&
							<AvatarModule
								key={uuid}
								uuid={uuid}
								image={cachedData[uuid ?? ""]?.avatar ?? undefined}
								cornerButton={uuid === hostUuid ? "host" : ""}
							/>
					))}
				</div>
				<div className="flex gap-2rem pt-2rem">
					{ members.length > 1 && <UnseatButton /> }
					{ members.length > 1 && <BotManagerButton /> }
					{ round >= 1 && <ResultsCallButton /> }
				</div>
			</footer>
		</>
	);
}