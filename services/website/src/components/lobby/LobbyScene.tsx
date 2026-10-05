import { useEffect } from "react";
import { handlePutSettings } from "../../api/profile/put_settings/handlePutSettings";
import { useAuthStore } from "../../store/AuthStore";
import { useBotStore } from "../../store/BotStore";
import { useGameStore } from "../../store/GameStore"; 
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";
import { useResultsStore } from "../../store/ResultsStore";
import { useSettingsStore } from "../../store/SettingsStore";
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
	const userSeats = useGameStore((store) => store.userSeats);
	// const seatRef = useGameStore((store => store.seatRef));
	const startGame = useGameStore((store) => store.startGame);
	const round = useGameStore((store) => store.round);
	const members = usePartyStore((store) => store.members);
	const hostUuid = usePartyStore((store) => store.hostUuid);
	const cachedData = useProfileStore((store) => store.cachedData);
	const resetResults = useResultsStore((store) => store.resetResults);

	useEffect(() => {
		const humansSeated = userSeats.filter((seat): seat is string => seat !== null && !seat.includes("bot")).length;
		if (humansSeated === members.length) {
			// fillSeatsWithBots();
			return;
		}
		
		if (userSeats.includes(null)) {
			resetResults();
			removeBots();
		}
	}, [members, userSeats]);

	const seatsFilled = totalPlayers === userSeats.filter((seat): seat is string => seat !== null).length;

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
							( userSeats[2]
								?
									<AvatarModule
										key={userSeats[2]}
										uuid={userSeats[2]}
										image={cachedData[userSeats[2]]?.avatar ?? undefined}
										cornerButton={userSeats[2] === hostUuid ? "host" : ""}
									/>
								: <TakeSeatButton seatNumber={2}/>
							)
						}
						{ totalPlayers === 3 &&
							<>
								{ userSeats[1]
									? 
										<AvatarModule
											key={userSeats[1]}
											uuid={userSeats[1]}
											image={cachedData[userSeats[1]]?.avatar ?? undefined}
											cornerButton={userSeats[1] === hostUuid ? "host" : ""}
										/>
									: <TakeSeatButton seatNumber={1}/>
								}
								{ userSeats[2]
									?
										<AvatarModule
											key={userSeats[2]}
											uuid={userSeats[2]}
											image={cachedData[userSeats[2]]?.avatar ?? undefined}
											cornerButton={userSeats[2] === hostUuid ? "host" : ""}
										/>
									: <TakeSeatButton seatNumber={2}/>
								}
							</>
						}
						{ totalPlayers === 2 &&
							( userSeats[1]
								?
									<AvatarModule
										key={userSeats[1]}
										uuid={userSeats[1]}
										image={cachedData[userSeats[1]]?.avatar ?? undefined}
										cornerButton={userSeats[1] === hostUuid ? "host" : ""}
									/>
								: <TakeSeatButton seatNumber={1}/>
							)
						}
					</div>
					<div className={`
						w-full h-full
						flex
						place-items-center place-content-evenly
					`}>
						{ totalPlayers === 4 &&
							( userSeats[1]
								?
									<AvatarModule
										key={userSeats[1]}
										uuid={userSeats[1]}
										image={cachedData[userSeats[1]]?.avatar ?? undefined}
										cornerButton={userSeats[1] === hostUuid ? "host" : ""}
									/>
								: <TakeSeatButton seatNumber={1}/>
							)
						}
						<button
							data-tip={seatsFilled ? "Let's Play!" : "Waiting for seats to be filled"}
							disabled={!(seatsFilled && clientUuid === hostUuid)}
							onClick={() => {
								handlePutSettings({
									allow3OfAKind: useSettingsStore.getState().allow3OfAKind,
									allow2OfSpadesEnd: useSettingsStore.getState().allow2OfSpadesEnd,
									autoPassIndex: useSettingsStore.getState().autoPassIndex,
									endGameCondition: 0,
									scoreCalculation: 0,
									cardStyle: 0,
									uiColor: 0,
									fxLevel: 0,
									mxLevel: 0,
								});
								startGame;
							}}
							className="
								btn-text bg-light
								h-3rem aspect-4/1
								text-1.25rem text-n0
								data-tip-up
						">
							START
						</button>
						{ totalPlayers === 4 &&
							( userSeats[3]
								?
									<AvatarModule
										key={userSeats[3]}
										uuid={userSeats[3]}
										image={cachedData[userSeats[3]]?.avatar ?? undefined}
										cornerButton={userSeats[3] === hostUuid ? "host" : ""}
									/>
								: <TakeSeatButton seatNumber={3}/>
								)
								}
					</div>
					<div className="w-full h-full grid place-items-center place-content-center">
						{ userSeats[0]
							?
								<AvatarModule
									key={userSeats[0]}
									uuid={userSeats[0]}
									image={cachedData[userSeats[0]]?.avatar ?? undefined}
									cornerButton={userSeats[0] === hostUuid ? "host" : ""}
								/>
							: <TakeSeatButton seatNumber={0}/>
						}
					</div>
				</div>
			</main>
			<footer className="
				pointer-events-auto
				flex place-content-between place-items-center
				relative
			">
				<div
					tabIndex={-1}
					className="
						w-full
						flex
						gap-2rem pt-2rem
						sm:overflow-x-visible overflow-x-auto
				">
					<PartyCallButton />
					{ members.map((uuid) => (
						uuid && !userSeats.includes(uuid) &&
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