import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, PerspectiveCamera, OrbitControls, AdaptiveDpr } from "@react-three/drei";
import { useGameStore } from "../store/useGameStore";
import { useSceneStore } from "../store/useSceneStore";
import { useDevStore } from "../store/useDevStore";
import { SphereBg } from "../components/SphereBg";
import { BackButton } from "../components/BackButton";
import { SettingsButton, SettingsLightbox } from "../components/Settings";
import { RankButton, RankLightbox } from "../components/RankButton";
import { YeahButton, HmmmButton, WoahButton } from "../components/EmojiButtons";
import { AvatarPlayer } from "../components/Avatar";
import { ChatLightbox } from "../components/Chat";

export const R3F = () => {
	const setCurrentScene = useGameStore((state) => state.setCurrentScene);
	const showStats = useDevStore((state) => state.showStats);
	const containerRef = useRef(null);
	const setContAreaWidth = useSceneStore((state) => state.setContAreaWidth);
	const setContAreaHeight = useSceneStore((state) => state.setContAreaHeight);
	const [showLightbox, setShowLightbox] = useState({
		settings: false,
		rank: false,
		chat: false,
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
		})}
	, []);

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
		<div className="cont">
			{/* <StripeBg /> */}
			<section ref={containerRef} className="cont-main">
				<Canvas className="cont-main-canvas">
					{showStats && <Stats />}
					<AdaptiveDpr />
					<ambientLight intensity={0.5}/>
					<SphereBg />
					<PerspectiveCamera makeDefault position={[0, 0, 2.25]} />
					<OrbitControls enableZoom={false}/>
				</Canvas>
				<div className="cont-main-body" />
			</section>
			<section className="cont-overlay">
				<header className="
					cont-overlay-header
					flex place-content-between
				">
					<div className="flex btn-icon-border">
						<BackButton scene={() => setCurrentScene("LOBBY")} />
						<SettingsButton call={(e) => toggleLightbox("settings", true, e)} />
						<RankButton call={(e) => toggleLightbox("rank", true, e)} />
					</div>
					<div className="flex btn-icon-border">
						<YeahButton />
						<HmmmButton />
						<WoahButton />
					</div>
				</header>
				<main className="cont-overlay-body flex">
					<div className="w-full h-full">
					</div>
				</main>
				<footer className="cont-overlay-footer flex place-items-center">
					<AvatarPlayer showChatButton={true} call={(e) => toggleLightbox("chat", true, e)}/>
				</footer>
			</section>
			{ showLightbox["settings"] && <SettingsLightbox dismiss={() => toggleLightbox("settings", false)} /> }
			{ showLightbox["rank"] && <RankLightbox dismiss={() => toggleLightbox("rank", false)} /> }
			{ showLightbox["chat"] && <ChatLightbox dismiss={() => toggleLightbox("chat", false)} /> }
		</div>
		</>
	);
}