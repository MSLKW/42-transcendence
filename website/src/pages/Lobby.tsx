import { useSceneStore } from "../store/SceneStore";
import { useGameStore } from "../store/GameStore";
import { usePartyStore } from "../store/PartyStore";
import { BackButton } from "../components/button/Back";
import { SettingsButton } from "../components/button/Settings";
import { InfoButton } from "../components/button/Info";
import { EmojiButton } from "../components/button/Emoji";
import { AvatarButton } from "../components/button/Avatar";
import { ChatButton } from "../components/button/Chat";
import { PartyButton } from "../components/button/Party";
import { SmallLogo } from "../components/label/Logo";

export const Lobby = () => {
	const { totalPlayers } = useGameStore();
	const { partyCount } = usePartyStore();
	const { setCurrentScene } = useSceneStore();

	return (
		<>
			<section className="cont-body">
				<header className="flex justify-between">
					<div className="flex btn-icon-border">
						<BackButton scene={() => setCurrentScene("HOME")} />
						<SettingsButton />
						<InfoButton />
					</div>
					<div className="flex btn-icon-border">
						<EmojiButton />
						<ChatButton />
					</div>
				</header>
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
			</section>
		</>
	);
}