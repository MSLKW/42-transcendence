import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, PerspectiveCamera, OrbitControls, AdaptiveDpr } from "@react-three/drei";
import { useGameStore } from "../store/useGameStore";
import { useSceneStore } from "../store/useSceneStore";
import { useDevStore } from "../store/useDevStore";
import { SphereBg } from "../components/SphereBg";
import { BackButton } from "../components/BackButton";
import { SettingsButton, SettingsLightbox } from "../components/Settings";
import { YeahButton, HmmmButton, WoahButton } from "../components/EmojiButtons";
import { AvatarPlayer } from "../components/Avatar";
import { ChatLightbox } from "../components/Chat";
import { JoinParty, PartyLightbox } from "../components/Party";
import { SmallLogo } from "../components/Logo";

export const Lobby = () => {
	const setCurrentScene = useGameStore((state) => state.setCurrentScene);
	const setContAreaWidth = useSceneStore((state) => state.setContAreaWidth);
	const setContAreaHeight = useSceneStore((state) => state.setContAreaHeight);
	const showStats = useDevStore((state) => state.showStats);
	const containerRef = useRef(null);
	const [showLightbox, setShowLightbox] = useState({
		settings: false,
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

	return (
		<>
			<section ref={containerRef} className="cont-canvas">
				<Canvas>
					{showStats && <Stats />}
					<AdaptiveDpr />
					{/* <ambientLight intensity={0.5}/> */}
					<directionalLight position={[0, 0, 5]} intensity={1} />
					<SphereBg />
					<PerspectiveCamera makeDefault position={[0, 0, 2.25]} />
					<OrbitControls enableZoom={false}/>
				</Canvas>
			</section>
			<section className="cont-body">
				<header className="flex justify-between">
					<div className="flex btn-icon-border">
						<BackButton scene={() => setCurrentScene("HOME")} />
						<SettingsButton call={(e) => toggleLightbox("settings", true, e)} />
					</div>
					<div className="flex btn-icon-border">
						<YeahButton />
						<HmmmButton />
						<WoahButton />
					</div>
				</header>
				<main className="flex flex-col place-content-evenly place-items-evenly">
					<AvatarPlayer playerName="Void"/>
					<div className="
						w-full
						grid grid-cols-3 place-items-center
					">
						<AvatarPlayer
							playerName="Null"
						/>
						<button
							className="btn-white"
							onClick={() => setCurrentScene("R3F")}
						>
							START
						</button>
						<AvatarPlayer
							playerName="Undefined"
						/>
					</div>
					<AvatarPlayer
						cornerButton="chat"
						call={(e) => toggleLightbox("chat", true, e)}
						playerName="Azrul"
					/>
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
						<AvatarPlayer
							playerName="Spectator"
						/>
						<JoinParty 
							call={(e) => toggleLightbox("party", true, e)}
						/>
					</div>
					<SmallLogo />
				</footer>
			</section>
			{ showLightbox["settings"] && <SettingsLightbox dismiss={() => toggleLightbox("settings", false)} /> }
			{ showLightbox["chat"] && <ChatLightbox dismiss={() => toggleLightbox("chat", false)} /> }
			{ showLightbox["party"] && <PartyLightbox dismiss={() => toggleLightbox("party", false)} /> }
		</>
	);
}