import { useRef, useEffect } from "react";
import { useSceneStore } from "../store/SceneStore";
import { useGameStore } from "../store/GameStore";
import { usePartyStore } from "../store/PartyStore";
import { InfoButton } from "../components/Info";
import { SignOutButton } from "../components/button/SignOutButton";
import { SettingsButton } from "../components/Settings";
import { PersonIcon } from "../components/icons/PersonIcon";
import { TutorialIcon } from "../components/icons/TutorialIcon";
import { AvatarButton } from "../components/Avatar";
import { ChatButton } from "../components/Chat";
import { PartyButton } from "../components/Party";
import { EmojiButton } from "../components/button/EmojiButtons";
import { SmallLogo } from "../components/image/Logo";

interface HomeProps {
	gameMode?: number;
}

const GAMEMODE_DEV = 1;
const GAMEMODE_2PLAYERS = 2;
const GAMEMODE_3PLAYERS = 3;
const GAMEMODE_4PLAYERS = 4;

export const HomeCardButton = ({ gameMode = 4 }: HomeProps) => {
	const setCurrentScene = useSceneStore((state) => state.setCurrentScene);
	const { setGameValue } = useGameStore();

	return (
		<button
			onClick={() => {
				setGameValue("totalPlayers", gameMode);
				if (gameMode === GAMEMODE_DEV)
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
			{ gameMode === GAMEMODE_4PLAYERS &&
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
			{ gameMode === GAMEMODE_3PLAYERS &&
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
			{ gameMode === GAMEMODE_2PLAYERS &&
				<>
					<div className="
						w-[clamp(2.5rem,3.571vmin+1.786rem,5rem)] aspect-square
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
			{ gameMode === GAMEMODE_DEV &&
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

export const Home = () => {
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

	const { partyCount, members } = usePartyStore();

	return (
		<>
			<section className="cont-body">
				<header className="flex justify-between">
					<div className="flex bg-n1 border border-n2 rounded-3xl">
	 					<SignOutButton />
	 					<SettingsButton />
						<InfoButton />
	 				</div>
	 				<div className="flex btn-icon-border">
						<EmojiButton />
						<ChatButton />
					</div>
				</header>
				<main>
					<div tabIndex={-1} className="
						absolute top-0 left-0
						w-full h-full
						pt-[clamp(5rem,25vh,20rem)] pb-[clamp(10rem,32vh,20rem)]
		 				flex
		 				overflow-x-auto
		 				snap-x snap-mandatory
		 			">
		 				<div className="
		 					flex place-content-center-safe place-items-center gap-[clamp(1.25rem,1.786vw+0.893rem,2.5rem)]
							w-full h-full
							flex-5
							pointer-events-auto
		 				">
		 					<HomeCardButton gameMode={GAMEMODE_4PLAYERS}/>
		 					<HomeCardButton gameMode={GAMEMODE_3PLAYERS}/>
		 					<HomeCardButton gameMode={GAMEMODE_2PLAYERS}/>
		 					<HomeCardButton gameMode={GAMEMODE_DEV}/>
		 				</div>
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
						{ Array.from({ length: partyCount }).map((_, index) => (
							<AvatarButton key={index} playerIndex={index} cornerButton={members[index].isHost === true ? "host" : "remove"}/>
						))}
						<PartyButton />
					</div>
					<SmallLogo />
				</footer>
			</section>
		</>
	);
}