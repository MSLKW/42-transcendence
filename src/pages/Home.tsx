import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useGameStore } from "../store/useGameStore";
import { useSceneStore } from "../store/useSceneStore";
import { useDevStore } from "../store/useDevStore";
import { InfoButton, InfoLightbox } from "../components/Info";
import { BackIcon } from "../icons/BackIcon";

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
			<section ref={containerRef} className="cont-area">
				<div className="z-0 flex flex-col w-full h-full">
					<div className="
						cont-row basis-12.5 shrink
						justify-between
						"
					>
						<div className="flex gap-5 bg-n1 border border-n2 rounded-3xl">
							<button>
								<BackIcon />
							</button>
							<button>Settings</button>
						</div>
						<InfoButton call={() => toggleLightbox("info", true)}/>
					</div>
				</div>
				{ showLightbox["info"] && <InfoLightbox dismiss={() => toggleLightbox("info", false)} /> }
			</section>
		</main>
	);
}