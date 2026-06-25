import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useGameStore } from "../store/useGameStore";
import { useSceneStore } from "../store/useSceneStore";
import { useDevStore } from "../store/useDevStore";
import { InfoButton, InfoLightbox } from "../components/Info";
import { BackIcon } from "../icons/BackIcon";
import { SettingsIcon } from "../icons/SettingsIcon";

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
							<button><BackIcon /></button>
							<button><SettingsIcon /></button>
						</div>
						<InfoButton call={() => toggleLightbox("info", true)}/>
					</div>
					<div className="
						cont-row min-h-10 h-full flex-3
						overflow-scroll
						"
					>
						{/* flex place-content-center place-items-center gap-10 */}
						<div className="
							w-max
							flex place-items-center gap-10
							overflow-visible
							"
						>
							<button className="btn-card">JOIN PARTY</button>
							<button className="btn-card">BIG 2 CLASSIC</button>
							<button className="btn-card">3 PLAYERS</button>
							<button className="btn-card">DUEL</button>
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
				{/* <div className="
					z-[-1] absolute top-0
					cont-row min-h-10 h-full flex-3
					overflow-scroll
					"
				>
					<div className="
						w-full
						flex place-content-center place-items-center gap-10
						overflow-visible
						"
					>
						<button className="
							flex-none
							bg-linear-to-b from-b4 to-b5
							border border-b6 rounded-3xl
							w-50 min-h-75
							"
						/>
						<button className="
							flex-none
							bg-linear-to-b from-b4 to-b5
							border border-b6 rounded-3xl
							w-full min-w-50 max-w-[400px]
							h-full min-h-75 max-h-[600px]
							aspect-auto
							"
						/>
						<button className="
							flex-none
							bg-linear-to-b from-b4 to-b5
							border border-b6 rounded-3xl
							w-50 h-75
							"
						/>
						<button className="
							flex-none
							bg-linear-to-b from-b4 to-b5
							border border-b6 rounded-3xl
							w-50 h-75
							"
						/>
					</div>
				</div> */}
				{ showLightbox["info"] && <InfoLightbox dismiss={() => toggleLightbox("info", false)} /> }
			</section>
		</main>
	);
}