import { useEffect } from "react";
import { useSceneStore } from "../store/SceneStore";
import { useGameStore } from "../store/GameStore";
import { usePartyStore } from "../store/PartyStore";
import { HeaderModule } from "../modules/Header";
import { SmallLogo } from "../modules/Logo";
import { AvatarButton } from "../components/button/Avatar";
import { PartyButton } from "../components/button/Party";

export const Lobby = () => {
	const { totalPlayers, playerOrder } = useGameStore();
	const { partyCount, members } = usePartyStore();
	const { setCurrentScene } = useSceneStore();

	useEffect(() => {
		for (let i = 0; i < totalPlayers; i++)
			if (i < partyCount)
				playerOrder[i] = members[i].name;
			else
				playerOrder[i] = "bot-" + i;
	}, []);

	return (
		<>
			<HeaderModule back="HOME"/>
			<main className="flex flex-col place-content-evenly place-items-evenly">
					<div className={`
					w-full h-full
					grid ${ totalPlayers === 3 ? "grid-cols-2" : "grid-cols-1" } grid-rows-1
					place-content-evenly place-items-center
				`}>
					{ totalPlayers === 4 && <AvatarButton playerIndex={2} /> }
					{ totalPlayers === 3 &&
						<>
							<AvatarButton playerIndex={1} />
							<AvatarButton playerIndex={2} />
						</>
					}
					{ totalPlayers === 2 && <AvatarButton playerIndex={1} /> }
				</div>
				<div className={`
					w-full h-full
					grid ${totalPlayers === 4 ? "grid-cols-3" : "grid-cols-1" } place-items-center
				`}>
					{ totalPlayers === 4 && <AvatarButton playerIndex={1} /> }
					<button
						className="btn-white hw-4/1"
						onClick={() => setCurrentScene("R3F")}
					>
						START
					</button>
					{ totalPlayers === 4 && <AvatarButton playerIndex={3} /> }
				</div>
				<div className="w-full h-full grid place-items-center place-content-center">
					<AvatarButton playerIndex={0} />
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
					gap-[clamp(0.25rem,3vw+0.125rem,2.5rem)]
					sm:overflow-x-visible overflow-x-auto
				">
					{ partyCount > totalPlayers && 
						Array.from({ length: partyCount - totalPlayers }, (_, index) => {
							const playerIndex = totalPlayers + index;
							return (
								<AvatarButton playerIndex={playerIndex} />
							)
						})
					}
					<PartyButton />
				</div>
				<SmallLogo />
			</footer>
		</>
	);
}