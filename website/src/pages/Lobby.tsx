import { useRef, useEffect } from "react";
import { useSceneStore } from "../store/useSceneStore";
import { useGameStore } from "../store/GameStore";
import { usePartyStore } from "../store/PartyStore";
import { BackButton } from "../components/BackButton";
import { SettingsButton } from "../components/Settings";
import { InfoButton } from "../components/Info";
import { EmojiButton } from "../components/EmojiButtons";
import { AvatarButton } from "../components/Avatar";
import { ChatButton } from "../components/Chat";
import { PartyButton } from "../components/Party";
import { SmallLogo } from "../components/image/Logo";

export const Lobby = () => {
	const setCurrentScene = useSceneStore((state) => state.setCurrentScene);
	const setContAreaWidth = useSceneStore((state) => state.setContAreaWidth);
	const setContAreaHeight = useSceneStore((state) => state.setContAreaHeight);
	
	const containerRef = useRef(null);
	useEffect(() => {
		if (!containerRef.current)
			return;

		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				setContAreaWidth(entry.target.scrollWidth);
				setContAreaHeight(entry.target.scrollHeight);
			}
		});
		observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, []);

	const totalPlayers = useGameStore((state) => state.totalPlayers);
	const partyCount = usePartyStore((state) => state.partyCount);

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