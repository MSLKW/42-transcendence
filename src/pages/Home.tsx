import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useGameStore } from "../store/useGameStore";
import { useSceneStore } from "../store/useSceneStore";
import { useDevStore } from "../store/useDevStore";
import { BackButton } from "../components/BackButton";
import { InfoButton, InfoLightbox } from "../components/Info";
import { SettingsButton, SettingsLightbox } from "../components/Settings";

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
		<main>
			{showStats && <div className="cont-three"><Canvas><Stats /></Canvas></div>}
			<section ref={containerRef} className="cont-area p-0">
				<div className="z-0 flex flex-col w-full h-full justify-between">
					<div className="
						cont-row basis-12.5 shrink
						p-10
						justify-between
						"
					>
						<div className="flex gap-0 bg-n1 border border-n2 rounded-3xl">
							<BackButton scene={() => setCurrentScene("LOGIN")} />
							<SettingsButton call={() => toggleLightbox("settings", true)} />
						</div>
						<InfoButton call={() => toggleLightbox("info", true)} />
					</div>
					<div tabIndex={-1} className="
						flex w-full min-h-10 h-full flex-3
						overflow-x-auto
						snap-x snap-mandatory
						"
					>
						<div className="
							flex place-items-center gap-10
							px-10 mx-auto
							"
						>
							<button className="btn-card">JOIN PARTY</button>
							<button className="btn-card">4 PLAYERS</button>
							<button className="btn-card">3 PLAYERS</button>
							<button className="btn-card">2 PLAYERS</button>
						</div>
					</div>
					<div className="
						cont-row basis-20 shrink
						gap-10
						p-10
						"
					>
						<div className="w-[80px] h-[100px] bg-a5 border border-a6 rounded-lg" />
						<div className="w-[80px] h-[100px] bg-a5 border border-a6 rounded-lg" />
					</div>
				</div>
				{ showLightbox["info"] && <InfoLightbox dismiss={() => toggleLightbox("info", false)} /> }
				{ showLightbox["settings"] && <SettingsLightbox dismiss={() => toggleLightbox("settings", false)} /> }
			</section>
		</main>
	);
}