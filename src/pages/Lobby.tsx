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
		<main>
			{showStats && <div className="cont-three"><Canvas><Stats /></Canvas></div>}
			<section ref={containerRef} className="cont-area relative">
				<div className="
					absolute w-[calc(100%-80px)]
					flex justify-between
					"
				>
					<div className="flex gap-0 bg-n1 border border-n2 rounded-3xl">
						<BackButton scene={() => setCurrentScene("HOME")} />
						<SettingsButton call={() => toggleLightbox("settings", true)} />
						<button className="bg-n1 border border-n2 w-12.5 aspect-square rounded-3xl" />
					</div>
					<div className="flex gap-0 bg-n1 border border-n2 rounded-3xl">
						<button className="bg-n1 border border-n2 w-12.5 aspect-square rounded-3xl" />
						<button className="bg-n1 border border-n2 w-12.5 aspect-square rounded-3xl" />
						<button className="bg-n1 border border-n2 w-12.5 aspect-square rounded-3xl" />
					</div>
				</div>
				<div className="cont-row flex-1 h-full flex flex-col justify-center place-items-center">
					<AvatarPlayer />
					<div className="flex place-items-center gap-10">
						<AvatarPlayer />
						<button className="w-40 h-10 bg-n6 border border-n5 rounded-3xl">START</button>
						<AvatarPlayer />
					</div>
					<AvatarPlayer />
				</div>
				<div className="absolute bottom-10">
					<AvatarPlayer />
				</div>
			</section>
			{ showLightbox["settings"] && <SettingsLightbox dismiss={() => toggleLightbox("settings", false)} /> }
		</main>
	);
}