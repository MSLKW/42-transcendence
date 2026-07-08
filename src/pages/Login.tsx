import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, PerspectiveCamera, OrbitControls, AdaptiveDpr } from "@react-three/drei";
import { useSceneStore } from "../store/useSceneStore";
import { useGameStore } from "../store/useGameStore";
import { useDevStore } from "../store/useDevStore";
import { StripeBg } from "../components/StripeBg";
import { SphereBg } from "../components/SphereBg";
import { BigLogo } from "../components/Logo";
import { InfoButton } from "../components/Info";
import { CreateAccountButton } from "../components/CreateAccount";
import { SignInButton } from "../components/SignIn";
import { Card } from "../components/PCard";

export const Login = () => {
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
	
	return (
		<>
			<StripeBg />
			<section ref={containerRef} className="cont-canvas">
				<Canvas>
					{showStats && <Stats />}
					<AdaptiveDpr />
					<ambientLight intensity={0.5}/>
					<directionalLight position={[0, 5, 5]} intensity={0.5} />
					<Card
						position={[0,0.25,0]}
						rotation={[-Math.PI/4,0,0]}
						color="gold"
					/>
					<SphereBg />
					<PerspectiveCamera makeDefault position={[0, 0, 2.25]} />
					<OrbitControls enableZoom={false}/>
				</Canvas>
				<main className="
					absolute top-0
					flex place-content-center
					pointer-events-none
				">
					<BigLogo />
				</main>
			</section>
			<section className="cont-body">
				<header className="flex">
					<div className="btn-icon-border">
						<InfoButton />
					</div>
				</header>
				<div className="h-full"/>
				<footer className="
					flex flex-col place-content-center place-items-center
					gap-[clamp(0.75rem,2.308vh+0.058rem,1.5rem)]
				">
					<div className="
						flex place-content-center place-items-center
						gap-[clamp(0.75rem,2.308vh+0.058rem,1.5rem)]
						flex-wrap
					">
						<SignInButton />
						<button onClick={() => setCurrentScene("HOME")} className="btn-white">PLAY AS GUEST</button>
					</div>
					<CreateAccountButton />
				</footer>
				<div className="h-[clamp(0rem,30.769vh-9.231rem,10rem)]"/>
			</section>
		</>
	);
}