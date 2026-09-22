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
import { PartyButton } from "../components/Party";
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

	const gameMode = useGameStore((state) => state.gameMode);
	const partyCount = useGameStore((state) => state.partyCount);

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
					<div className={`
						w-full h-full
						grid ${ gameMode === 3 ? "grid-cols-2" : "grid-cols-1" } grid-rows-1
						place-content-evenly place-items-center
					`}>
						{ gameMode === 4 && <AvatarButton key={2} playerIndex={2} /> }
						{ gameMode === 3 &&
							<>
								<AvatarButton key={1} playerIndex={1} />
								<AvatarButton key={2} playerIndex={2} />
							</>
						}
						{ gameMode === 2 && <AvatarButton key={1} playerIndex={1} /> }
					</div>
					<div className={`
						w-full h-full
						grid ${gameMode === 4 ? "grid-cols-3" : "grid-cols-1" } place-items-center
					`}>
						{ gameMode === 4 && <AvatarButton key={1} playerIndex={1} /> }
						<button
							className="btn-white hw-4/1"
							onClick={() => setCurrentScene("R3F")}
						>
							START
						</button>
						{ gameMode === 4 && <AvatarButton key={3} playerIndex={3} /> }
					</div>
					<div className="w-full h-full grid place-items-center place-content-center">
						<AvatarButton key={0} playerIndex={0} role="self" />
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
						{ partyCount > gameMode && 
							Array.from({ length: partyCount - gameMode }, (_, index) => {
								const playerIndex = gameMode + index;
								return (
									<AvatarButton key={playerIndex} playerIndex={playerIndex} />
								)
							})
						}
						<PartyButton />
					</div>
					<SmallLogo />
				</footer>
			</section>
		</>
	);
}