import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, PerspectiveCamera, OrbitControls, AdaptiveDpr } from "@react-three/drei";
import { useSceneStore } from "../store/useSceneStore";
import { useGameStore } from "../store/useGameStore";
import { useDevStore } from "../store/useDevStore";
import { SphereBg } from "../components/SphereBg";
import { BackButton } from "../components/BackButton";
import { SettingsButton } from "../components/Settings";
import { InfoButton } from "../components/Info";
import { EmojiButton } from "../components/EmojiButtons";
import { AvatarButton } from "../components/Avatar";
import { ChatButton } from "../components/Chat";
import { JoinParty } from "../components/Party";
import { SmallLogo } from "../components/Logo";

export const Lobby = () => {
	const setCurrentScene = useSceneStore((state) => state.setCurrentScene);
	const setContAreaWidth = useSceneStore((state) => state.setContAreaWidth);
	const setContAreaHeight = useSceneStore((state) => state.setContAreaHeight);
	const showStats = useDevStore((state) => state.showStats);
	
	const containerRef = useRef(null);
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

	const playerList = useGameStore((state) => state.playerList);

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
						<SettingsButton />
						<InfoButton />
					</div>
					<div className="flex btn-icon-border">
						<EmojiButton />
						<ChatButton />
					</div>
				</header>
				<main className="flex flex-col place-content-evenly place-items-evenly">
					<div className="w-full h-full grid place-items-center place-content-center">
						<AvatarButton playerName={playerList[2]} />
					</div>
					<div className="
						w-full h-full
						grid grid-cols-3 place-items-center
					">
						<AvatarButton playerName={playerList[1]} />
						<button
							className="btn-white hw-4/1"
							onClick={() => setCurrentScene("R3F")}
						>
							START
						</button>
						<AvatarButton playerName={playerList[3]} />
					</div>
					<div className="w-full h-full grid place-items-center place-content-center">
						<AvatarButton playerName="Azrul" role="self"/>
					</div>
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
						<JoinParty />
					</div>
					<SmallLogo />
				</footer>
			</section>
		</>
	);
}