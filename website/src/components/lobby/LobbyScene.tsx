import { useEffect, useRef } from "react";
import { partySocket } from "../../api/party/partySocket";
import { useBotStore } from "../../store/BotStore";
import { useGameStore } from "../../store/GameStore"; 
import { usePartyStore } from "../../store/PartyStore";
import { useSceneStore } from "../../store/SceneStore";
import { HeaderModule } from "../header/HeaderModule";
import { SmallLogo } from "../logo/SmallLogo";
import { AvatarButton } from "../avatar/AvatarButton";
import { PartyButton } from "../party/invite/InviteButton";

export const LobbyScene = () => {
	const { totalPlayers } = useGameStore();
	const { members } = usePartyStore();
	const { setCurrentScene } = useSceneStore();
	const { addBotToParty } = useBotStore();
	
	const hasRunRef = useRef(false);
	useEffect(() => {
		if (hasRunRef.current)
			return;
		hasRunRef.current = true;

		let i = members.length;
		while (i < totalPlayers) {
			addBotToParty(`bot-${i}`);
			i++;
		}
		partySocket.updateGameMode(totalPlayers);
		partySocket.startGameSession();
		hasRunRef.current = false;
	}, [members.length, totalPlayers]);

	return (
		<>
			<HeaderModule back="HOME"/>
			<main className="flex flex-col place-content-evenly place-items-evenly">
				<div className={`
					h-full
					grid ${ totalPlayers === 3 ? "grid-cols-2" : "grid-cols-1" } grid-rows-1
					place-content-evenly place-items-center
				`}>
					{ totalPlayers === 4 && members[2] && members[2].uuid &&
						<AvatarButton
							key={members[2].uuid}
							uuid={members[2].uuid}
						/>
					}
					{ totalPlayers === 3 &&
						<>
							{ members[1] && members[1].uuid &&
								<AvatarButton
									key={members[1].uuid}
									uuid={members[1].uuid}
								/>
							}
							{ members[2] && members[2].uuid &&
								<AvatarButton
									key={members[2].uuid}
									uuid={members[2].uuid}
								/>
							}
						</>
					}
					{ totalPlayers === 2 && members[1] && members[1].uuid &&
						<AvatarButton
							key={members[1].uuid}
							uuid={members[1].uuid}
						/>
					}
				</div>
				<div className={`
					w-full h-full
					grid ${totalPlayers === 4 ? "grid-cols-3" : "grid-cols-1" } place-items-center
				`}>
					{ totalPlayers === 4 && members[1] && members[1].uuid &&
						<AvatarButton
							key={members[1].uuid}
							uuid={members[1].uuid}
						/>
					}
					<button
						onClick={() => setCurrentScene("R3F")}
						className="
							btn-text bg-light
							h-3rem aspect-4/1
							text-1.25rem text-n0
						"
					>
						START
					</button>
					{ totalPlayers === 4 && members[3] && members[3].uuid &&
						<AvatarButton
							key={members[3].uuid}
							uuid={members[3].uuid}
						/>
					}
				</div>
				<div className="w-full h-full grid place-items-center place-content-center">
					{ members[0] && members[0].uuid &&
						<AvatarButton
							key={members[0].uuid}
							uuid={members[0].uuid}
						/>
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
					{ members.length > totalPlayers &&
						members.slice(totalPlayers).map((member) => {
							if (!member.uuid)
								return;
							return (
								<AvatarButton
									key={member.uuid}
									uuid={member.uuid}
								/>
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