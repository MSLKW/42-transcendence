import { useEffect } from "react";
import { useBotStore } from "../../store/BotStore";
import { useGameStore } from "../../store/GameStore"; 
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { HeaderModule } from "../header/HeaderModule";
import { SmallLogo } from "../logo/SmallLogo";
import { AvatarButton } from "../avatar/AvatarButton";
import { PartyButton } from "../party/invite/InviteButton";
import { TakeSeatButton } from "./TakeSeatButton";
import { UnseatButton } from "./UnseatButton";

export const fillWithBots = () => {
	let i = 0;
	while (i < useGameStore.getState().totalPlayers) {
		if (!useGameStore.getState().seats[i]) {
			useBotStore.getState().addBotToParty(`bot-${i}`);
			useGameStore.getState().setSeatWithUuid(`bot-${i}`, i);
		}
		i++;
	}
}

export const LobbyScene = () => {
	const { totalPlayers, seats } = useGameStore();
	const { members, humans, hostUuid } = usePartyStore();
	const { clientUuid } = useProfileStore();
	const { setCurrentScene } = useSceneStore();

	useEffect(() => {
		const totalSeated = seats.filter((seat): seat is string => seat !== null).length;

		if (totalSeated === members.length)
			fillWithBots();
	}, [members, seats]);

	return (
		<>
			<HeaderModule back="HOME"/>
			<main className="flex flex-col place-content-evenly place-items-evenly">
				<div className={`
					h-full
					grid ${ totalPlayers === 3 ? "grid-cols-2" : "grid-cols-1" } grid-rows-1
					place-content-evenly place-items-center
				`}>
					{ totalPlayers === 4 &&
						( seats[2]
							? <AvatarButton key={seats[2]} uuid={seats[2]} cornerButton={seats[2] === hostUuid ? "host" : ""}/>
							: <TakeSeatButton uuid={clientUuid!} seatNumber={2}/>
						)
					}
					{ totalPlayers === 3 &&
						<>
							{ seats[1]
								? <AvatarButton key={seats[1]} uuid={seats[1]} cornerButton={seats[1] === hostUuid ? "host" : ""}/>
								: <TakeSeatButton uuid={clientUuid!} seatNumber={1}/>
							}
							{ seats[2]
								? <AvatarButton key={seats[2]} uuid={seats[2]} cornerButton={seats[2] === hostUuid ? "host" : ""}/>
								: <TakeSeatButton uuid={clientUuid!} seatNumber={2}/>
							}
						</>
					}
					{ totalPlayers === 2 &&
						( seats[1]
							? <AvatarButton key={seats[1]} uuid={seats[1]} cornerButton={seats[1] === hostUuid ? "host" : ""}/>
							: <TakeSeatButton uuid={clientUuid!} seatNumber={1}/>
						)
					}
				</div>
				<div className={`
					w-full h-full
					grid ${totalPlayers === 4 ? "grid-cols-3" : "grid-cols-1" } place-items-center
				`}>
					{ totalPlayers === 4 &&
						( seats[1]
							? <AvatarButton key={seats[1]} uuid={seats[1]} cornerButton={seats[1] === hostUuid ? "host" : ""}/>
							: <TakeSeatButton uuid={clientUuid!} seatNumber={1}/>
						)
					}
					<button
						disabled={totalPlayers !== seats.filter((seat): seat is string => seat !== null).length}
						onClick={() => setCurrentScene("GAMEPLAY")}
						className="
							btn-text bg-light
							h-3rem aspect-4/1
							text-1.25rem text-n0
						"
					>
						START
					</button>
					{ totalPlayers === 4 &&
						( seats[3]
							? <AvatarButton key={seats[3]} uuid={seats[3]} cornerButton={seats[3] === hostUuid ? "host" : ""}/>
							: <TakeSeatButton uuid={clientUuid!} seatNumber={3}/>
							)
							}
				</div>
				<div className="w-full h-full grid place-items-center place-content-center">
					{ seats[0]
						? <AvatarButton key={seats[0]} uuid={seats[0]} cornerButton={seats[0] === hostUuid ? "host" : ""} />
						: <TakeSeatButton uuid={clientUuid!} seatNumber={0}/>
					}
				</div>
			</main>
			<footer className="
				pointer-events-auto
				flex place-content-between place-items-center
				relative
			">
				<div tabIndex={-1} className="
					z-1
					flex
					gap-2rem
					sm:overflow-x-visible overflow-x-auto
				">
					{ members.map((member) => (
						member.uuid && !seats.includes(member.uuid) &&
							<AvatarButton
								key={member.uuid}
								uuid={member.uuid}
								cornerButton={member.uuid === hostUuid ? "host" : ""}
							/>
					))}
					<PartyButton />
					{ seats.includes(clientUuid) && humans > 1 && <UnseatButton uuid={clientUuid!} /> }
				</div>
				<SmallLogo />
			</footer>
		</>
	);
}