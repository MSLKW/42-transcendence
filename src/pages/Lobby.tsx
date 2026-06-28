import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useGameStore } from "../store/useGameStore";
import { useDevStore } from "../store/useDevStore";
import { BackButton } from "../components/BackButton";
import { SettingsButton, SettingsLightbox } from "../components/Settings";
import { AvatarPlayer } from "../components/Avatar";

export const Lobby = () => {
	const setCurrentScene = useGameStore((state) => state.setCurrentScene);
	const showStats = useDevStore((state) => state.showStats);
	const containerRef = useRef(null);
	const [showLightbox, setShowLightbox] = useState({
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

	return (
		<>
			<section ref={containerRef} className="cont-main">
				<Canvas className="cont-main-canvas">
					{showStats && <Stats />}
				</Canvas>
			</section>
			<section className="cont-overlay">
				<header className="cont-overlay-header flex justify-between">
					<div className="flex gap-0 btn-icon-border">
						<BackButton scene={() => setCurrentScene("HOME")} />
						<SettingsButton call={() => toggleLightbox("settings", true)} />
						<button className="bg-n1 border border-n2 w-12.5 aspect-square rounded-3xl" />
					</div>
					<div className="flex gap-0 bg-n1 border border-n2 rounded-3xl">
						<button className="bg-n1 border border-n2 w-12.5 aspect-square rounded-3xl" />
						<button className="bg-n1 border border-n2 w-12.5 aspect-square rounded-3xl" />
						<button className="bg-n1 border border-n2 w-12.5 aspect-square rounded-3xl" />
					</div>
				</header>
				<main className="
					cont-overlay-body
					flex flex-col justify-center place-items-center gap-20
				">
					<AvatarPlayer />
					<div className="flex place-items-center gap-20">
						<AvatarPlayer />
						<button
							className="
								w-40 h-10
								bg-n6
								border border-n5 rounded-3xl
								"
							onClick={() => setCurrentScene("R3F")}
						>
							START
						</button>
						<AvatarPlayer />
					</div>
					<AvatarPlayer />
				</main>
				<footer className="cont-overlay-bottom">
					<AvatarPlayer showChatButton={true} />
				</footer>
			</section>
			{ showLightbox["settings"] && <SettingsLightbox dismiss={() => toggleLightbox("settings", false)} /> }
		</>
	);
}