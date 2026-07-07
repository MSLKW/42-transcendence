import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useSceneStore } from "../store/useSceneStore";
import { useGameStore } from "../store/useGameStore";
import { usePlayerStore } from "../store/usePlayerStore";
import { useDevStore } from "../store/useDevStore";
import { StripeBg } from "../components/StripeBg";
import { InfoButton, InfoLightbox } from "../components/Info";
import { SignOutButton } from "../components/SignOutButton";
import { SettingsButton, SettingsLightbox } from "../components/Settings";
import { PersonIcon } from "../icons/PersonIcon";
import { TutorialIcon } from "../icons/TutorialIcon";
import { AvatarPlayer } from "../components/Avatar";
import { ChatButton, ChatLightbox } from "../components/Chat";
import { JoinParty, PartyLightbox } from "../components/Party";
import { EmojiButton } from "../components/EmojiButtons";
import { SmallLogo } from "../components/Logo";

interface HomeProps {
	cardType: string;
}

export const HomeCards = ({ cardType }: HomeProps) => {
	const setCurrentScene = useSceneStore((state) => state.setCurrentScene);

	return (
		<button
			onClick={() => setCurrentScene("LOBBY")}
			className="btn-card"
		>
			{cardType === "4 PLAYERS" &&
				<div className="w-18.75 h-18.75 flex flex-col place-items-center">
					<PersonIcon />
					<div className="flex gap-6">
						<PersonIcon />
						<PersonIcon />
					</div>
					<PersonIcon />
				</div>
			}
			{cardType === "3 PLAYERS" &&
				<div className="w-18.75 h-18.75 flex flex-col place-items-center gap-3">
					<PersonIcon />
					<div className="flex gap-3">
						<PersonIcon />
						<PersonIcon />
					</div>
				</div>
			}
			{cardType === "2 PLAYERS" &&
				<div className="w-10 h-18.75 flex flex-col place-items-center gap-3">
					<PersonIcon />
					<PersonIcon />
				</div>
			}
			{cardType === "TUTORIAL" &&
				<div className="w-15 h-15">
					<TutorialIcon />
				</div>
			}
			<h1 className="text-n0 text-[clamp(0.5rem,4vw+0.25rem,1.5rem)]">{cardType}</h1>
		</button>
	);
}

export const Home = () => {
	const setContAreaWidth = useSceneStore((state) => state.setContAreaWidth);
	const setContAreaHeight = useSceneStore((state) => state.setContAreaHeight);
	const showStats = useDevStore((state) => state.showStats);
	const containerRef = useRef(null);
	const [showLightbox, setShowLightbox] = useState({
		settings: false,
		info: false,
		chat: false,
		party: false,
	});
	const toggleLightbox = (key: keyof typeof showLightbox, value: boolean, e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e)
			e.currentTarget.blur();
		setShowLightbox(() => ({
			...showLightbox,
			[key]: value,
		}));
	}
		
	const setGameStarted = useGameStore((state) => state.setGameStarted);
	useEffect(() => {
		setGameStarted(false);
	}, []);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	}, []);
	
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

	const partyCount = usePlayerStore((state) => state.partyCount);

	return (
		<>
			<StripeBg />
			<section ref={containerRef} className="cont-canvas">
				<Canvas>
					{showStats && <Stats />}
				</Canvas>
			</section>
			<section className="cont-body">
				<header className="flex justify-between">
					<div className="flex bg-n1 border border-n2 rounded-3xl">
	 					<SignOutButton />
	 					<SettingsButton call={(e) => toggleLightbox("settings", true, e)} />
						<InfoButton call={(e) => toggleLightbox("info", true, e)} />
	 				</div>
	 				<div className="flex btn-icon-border">
						<EmojiButton />
						<ChatButton call={(e) => toggleLightbox("chat", true, e)} />
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
		 					flex place-content-center-safe place-items-center gap-10
							w-full h-full
							flex-5
							pointer-events-auto
		 				">
		 					<HomeCards cardType="4 PLAYERS"/>
		 					<HomeCards cardType="3 PLAYERS"/>
		 					<HomeCards cardType="2 PLAYERS"/>
		 					<HomeCards cardType="TUTORIAL"/>
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
						<AvatarPlayer playerName="Azrul" />
						{partyCount >= 2 && <AvatarPlayer playerName="Max" />}
						{partyCount >= 3 && <AvatarPlayer playerName="Jeremy" />}
						{partyCount >= 4 && <AvatarPlayer playerName="Aisyah" />}
						<JoinParty call={(e) => toggleLightbox("party", true, e)} />
					</div>
					<SmallLogo />
				</footer>
			</section>
	 		{ showLightbox["info"] && <InfoLightbox dismiss={() => toggleLightbox("info", false)} /> }
	 		{ showLightbox["settings"] && <SettingsLightbox dismiss={() => toggleLightbox("settings", false)} /> }
	 		{ showLightbox["chat"] && <ChatLightbox dismiss={() => toggleLightbox("chat", false)} /> }
	 		{ showLightbox["party"] && <PartyLightbox dismiss={() => toggleLightbox("party", false)} /> }
		</>
	);
}