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
	const handleSort = (e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e)
			e.currentTarget.blur();
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
				<header className="flex place-content-between">
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
				<main>
					<div className="absolute left-[30%] top-[5%]">
						<AvatarPlayer
							cornerButton="cards"
							playerName="Max"
						/>
					</div>
					<div className="absolute left-[5%] top-[20%]">
						<AvatarPlayer
							cornerButton="cards"
							playerName="Jeremy"
						/>
					</div>
					<div className="absolute right-[5%] top-[20%]">
						<AvatarPlayer
							cornerButton="cards"
							playerName="Aisyah"
						/>
					</div>
					<div className="
						absolute left-1/2 top-[32.5%] -translate-x-1/2
					">
						<div className="
							bg-n1
							border border-n2 rounded-3xl
							text-n6
							text-[clamp(0.5rem,2vw+0.25rem,1rem)]
							px-[clamp(0.25rem,2vw+0.125rem,1.25rem)]
							py-[clamp(0.0625rem,0.5vh+0.03125rem,0.5rem)]
						">
							<p>Straight</p>
						</div>
					</div>
				</main>
				<footer className="flex place-content-between place-items-center">
					<AvatarPlayer cornerButton="chat" call={(e) => toggleLightbox("chat", true, e)}/>
					<div className="
						w-[clamp(1rem,10vw+0.5rem,5rem)] h-full
						flex flex-col place-content-between
						gap-[clamp(0.25rem,1vh+0.125rem,0.75rem)]
					">
						<button className="btn-sort" onClick={(e) => handleSort(e)}>Rank</button>
						<button className="btn-sort" onClick={(e) => handleSort(e)}>Suit</button>
						<button className="btn-sort" onClick={(e) => handleSort(e)}>Flex</button>
					</div>
				</footer>
			</section>
			{ showLightbox["settings"] && <SettingsLightbox dismiss={() => toggleLightbox("settings", false)} /> }
			{ showLightbox["rank"] && <RankLightbox dismiss={() => toggleLightbox("rank", false)} /> }
			{ showLightbox["chat"] && <ChatLightbox dismiss={() => toggleLightbox("chat", false)} /> }
		</>
	);
}