import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useGameStore } from "../store/useGameStore";
import { useSceneStore } from "../store/useSceneStore";
import { useDevStore } from "../store/useDevStore";
import { BackButton } from "../components/BackButton";
import { StripeBg } from "../components/StripeBg";
import { InfoButton, InfoLightbox } from "../components/Info";
import { SettingsButton, SettingsLightbox } from "../components/Settings";
import { AvatarPlayer } from "../components/Avatar";
import { JoinParty } from "../components/Party";

export const Home = () => {
	const setCurrentScene = useGameStore((state) => state.setCurrentScene);
	const setContAreaWidth = useSceneStore((state) => state.setContAreaWidth);
	const setContAreaHeight = useSceneStore((state) => state.setContAreaHeight);
	const showStats = useDevStore((state) => state.showStats);
	const containerRef = useRef(null);
	const [showLightbox, setShowLightbox] = useState({
		info: false,
		chat: false,
		settings: false,
	});
	const toggleLightbox = (key: keyof typeof showLightbox, value: boolean) => {
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
			<StripeBg />
			<section ref={containerRef} className="cont-main">
				<Canvas className="cont-main-canvas">
					{showStats && <Stats />}
				</Canvas>
			</section>
			<section className="cont-overlay">
				<header className="cont-overlay-header flex justify-between flex-1">
					<div className="flex bg-n1 border border-n2 rounded-3xl">
	 					<BackButton scene={() => setCurrentScene("LOGIN")} />
	 					<SettingsButton call={() => toggleLightbox("settings", true)} />
	 				</div>
	 				<InfoButton call={() => toggleLightbox("info", true)} />
				</header>
				<main className="cont-overlay-body">
					<div tabIndex={-1} className="
						absolute top-0 left-0
						pt-[clamp(0px,25vh,250px)] pb-[clamp(0px,32vh,300px)]
		 				flex w-full h-full
		 				overflow-x-auto
		 				snap-x snap-mandatory
		 			">
		 				<div className="
		 					flex place-content-center-safe place-items-center gap-10
							w-full h-full
							flex-5
		 				">
		 					<button className="btn-card" onClick={() => setCurrentScene("LOBBY")}>4 PLAYERS</button>
		 					<button className="btn-card" onClick={() => setCurrentScene("LOBBY")}>3 PLAYERS</button>
		 					<button className="btn-card" onClick={() => setCurrentScene("LOBBY")}>2 PLAYERS</button>
		 				</div>
		 			</div>
				</main>
				<footer className="cont-overlay-footer flex gap-10 flex-1">
	 				<AvatarPlayer />
	 				<JoinParty />
				</footer>
			</section>
	 		{ showLightbox["info"] && <InfoLightbox dismiss={() => toggleLightbox("info", false)} /> }
	 		{ showLightbox["settings"] && <SettingsLightbox dismiss={() => toggleLightbox("settings", false)} /> }
		</>
	);
}