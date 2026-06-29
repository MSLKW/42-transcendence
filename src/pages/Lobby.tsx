import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, PerspectiveCamera, OrbitControls, AdaptiveDpr } from "@react-three/drei";
import { useGameStore } from "../store/useGameStore";
import { useDevStore } from "../store/useDevStore";
import { SphereBg } from "../components/SphereBg";
import { BackButton } from "../components/BackButton";
import { SettingsButton, SettingsLightbox } from "../components/Settings";
import { RankButton, RankLightbox } from "../components/RankButton";
import { YeahButton, HmmmButton, WoahButton } from "../components/EmojiButtons";
import { AvatarPlayer } from "../components/Avatar";
import { ChatLightbox } from "../components/Chat";
import { JoinParty } from "../components/Party";

export const Lobby = () => {
	const setCurrentScene = useGameStore((state) => state.setCurrentScene);
	const showStats = useDevStore((state) => state.showStats);
	const containerRef = useRef(null);
	const [showLightbox, setShowLightbox] = useState({
		chat: false,
		settings: false,
		rank: false,
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

	return (
		<>
			<section ref={containerRef} className="cont-main">
				<Canvas className="cont-main-canvas">
					{showStats && <Stats />}
					<AdaptiveDpr />
					<ambientLight intensity={0.5}/>
					<SphereBg />
					<PerspectiveCamera makeDefault position={[0, 0, 2.25]} />
					<OrbitControls enableZoom={false}/>
				</Canvas>
			</section>
			<section className="cont-overlay">
				<header className="cont-overlay-header flex justify-between">
					<div className="flex btn-icon-border">
						<BackButton scene={() => setCurrentScene("HOME")} />
						<SettingsButton call={(e) => toggleLightbox("settings", true, e)} />
						<RankButton call={(e) => toggleLightbox("rank", true, e)} />
					</div>
					<div className="flex btn-icon-border">
						<YeahButton />
						<HmmmButton />
						<WoahButton />
					</div>
				</header>
				<main className="
					cont-overlay-body
					flex flex-col justify-center place-items-center gap-[clamp(0.25rem,10vh+0.25rem,10rem)]
				">
					<AvatarPlayer playerName="Void"/>
					<div className="flex place-items-center gap-[clamp(0.25rem,10vw+0.25rem,10rem)]">
						<AvatarPlayer
							showChatButton={false}
							playerName="Null"
						/>
						<button
							className="btn-white"
							onClick={() => setCurrentScene("R3F")}
						>
							START
						</button>
						<AvatarPlayer
							showChatButton={false}
							playerName="Undefined"
						/>
					</div>
					<AvatarPlayer
						showChatButton={true}
						playerName="Azrul"
					/>
				</main>
				<footer className="cont-overlay-footer flex gap-10">
					<AvatarPlayer
						showChatButton={false}
						call={(e) => toggleLightbox("chat", true, e)}
						playerName="Spectator"
					/>
					<JoinParty />
				</footer>
			</section>
			{ showLightbox["settings"] && <SettingsLightbox dismiss={() => toggleLightbox("settings", false)} /> }
			{ showLightbox["rank"] && <RankLightbox dismiss={() => toggleLightbox("rank", false)} /> }
			{ showLightbox["chat"] && <ChatLightbox dismiss={() => toggleLightbox("chat", false)} /> }
		</>
	);
}