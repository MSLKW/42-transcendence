import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, PerspectiveCamera, OrbitControls, AdaptiveDpr } from "@react-three/drei";
import { useSceneStore } from "../store/useSceneStore";
import { useDevStore } from "../store/useDevStore";
import { SphereBg } from "../components/SphereBg";
import { BackButton } from "../components/BackButton";
import { SettingsButton } from "../components/Settings";
import { RankButton } from "../components/RankButton";
import { EmojiButton } from "../components/EmojiButtons";
import { AvatarButton } from "../components/Avatar";
import { ChatButton } from "../components/Chat";
import { SortButtons } from "../components/SortButtons";
import { useGameStore } from "../store/useGameStore";

export const R3F = () => {
	const setCurrentScene = useSceneStore((state) => state.setCurrentScene);
	const showStats = useDevStore((state) => state.showStats);
	const containerRef = useRef(null);
	const setContAreaWidth = useSceneStore((state) => state.setContAreaWidth);
	const setContAreaHeight = useSceneStore((state) => state.setContAreaHeight);

	const [activePlayer, setActivePlayer] = useState<number>(0);
	const [animationKey, setAnimationKey] = useState<number>(0);
	const nextTurn = () => {
		setActivePlayer((prev) => (prev + 1) % 4);
		setAnimationKey((prev) => prev + 1);
	}
	useEffect(() => {
		const timer = setTimeout(() => {
			nextTurn();
			console.log("activePlayer:", activePlayer);
		}, 1000);

		return () => clearTimeout(timer);
	}, [activePlayer]);

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
				<header className="flex place-content-between">
					<div className="flex btn-icon-border">
						<BackButton scene={() => setCurrentScene("LOBBY")} />
						<SettingsButton />
					</div>
					<div className="flex btn-icon-border">
						<EmojiButton />
						<ChatButton />
					</div>
				</header>
				<main>
					{ gameMode === 4 &&
						<>
							<div className="absolute left-[25%] top-[5%]">
								<AvatarButton
									cornerButton="cardsLeft"
									playerIndex={2}
									isActive={false}
								/>
							</div>
							<div className="absolute left-[5%] top-[20%]">
								<AvatarButton
									cornerButton="cardsLeft"
									playerIndex={1}
									isActive={false}
								/>
							</div>
							<div className="absolute right-[5%] top-[20%]">
								<AvatarButton
									cornerButton="cardsLeft"
									playerIndex={3}
									isActive={false}
								/>
							</div>
						</>
					}
					{ gameMode === 3 &&
						<>
							<div className="absolute left-[5%] top-[20%]">
								<AvatarButton
									cornerButton="cardsLeft"
									playerIndex={1}
									isActive={false}
								/>
							</div>
							<div className="absolute right-[5%] top-[20%]">
								<AvatarButton
									cornerButton="cardsLeft"
									playerIndex={2}
									isActive={false}
								/>
							</div>
						</>
					}
					{ gameMode === 2 &&
						<div className="absolute left-[25%] top-[5%]">
							<AvatarButton
								cornerButton="cardsLeft"
								playerIndex={1}
								isActive={false}
							/>
						</div>
					}
					<div className="
						absolute left-1/2 top-[32.5%] -translate-x-1/2
					">
						<RankButton />
					</div>
					<div className="
						absolute left-1/2 top-[65%] -translate-x-1/2
						flex gap-[clamp(1.25rem,1.786vw+0.893rem,2.5rem)]
					">
						<button onClick={nextTurn} className="btn-white hw-4/1">PASS</button>
						<button onClick={nextTurn} className="btn-white hw-4/1">PLAY</button>
					</div>
				</main>
				<footer className="flex place-content-between place-items-center">
					<AvatarButton
						cornerButton="cardsLeft"
						playerIndex={0}
						isActive={true}
					/>
					<div className="
						w-[clamp(1rem,10vw+0.5rem,5rem)] h-full
						flex flex-col place-content-between
						gap-[clamp(0.25rem,2vh+0.125rem,0.75rem)]
					">
						<SortButtons />
					</div>
				</footer>
			</section>
		</>
	);
}