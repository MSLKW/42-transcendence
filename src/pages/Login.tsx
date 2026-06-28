import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useGameStore } from "../store/useGameStore";
import { useSceneStore } from "../store/useSceneStore";
import { useDevStore } from "../store/useDevStore";
import { StripeBg } from "../components/StripeBg";
import { InfoButton, InfoLightbox } from "../components/Info";
import { CreateAccountButton, CreateAccountLightbox } from "../components/CreateAccount";
import { SignInButton, SignInLightbox } from "../components/SignIn";

export const Login = () => {
	const setCurrentScene = useGameStore((state) => state.setCurrentScene);
	const setContAreaWidth = useSceneStore((state) => state.setContAreaWidth);
	const setContAreaHeight = useSceneStore((state) => state.setContAreaHeight);
	const showStats = useDevStore((state) => state.showStats);
	const containerRef = useRef(null);
	const [showLightbox, setShowLightbox] = useState({
		info: false,
		signIn: false,
		createAccount: false,
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
		});
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
				<div className="cont-main-body">
				</div>
			</section>
			<section className="cont-overlay">
				<header className="cont-overlay-header flex justify-end">
	 				<InfoButton call={() => toggleLightbox("info", true)}/>
				</header>
				<main className="cont-overlay-body">
				</main>
				<footer className="
					cont-overlay-footer
					flex flex-col place-content-center place-items-center gap-[clamp(0px,2vh,20px)]
				">
					<div className="
						w-full h-full
						flex place-content-center place-items-center gap-5
					">
						<SignInButton call={() => toggleLightbox("signIn", true)}/>
						<button onClick={() => setCurrentScene("HOME")} className="btn-text">PLAY AS GUEST</button>
					</div>
					<div className="
						w-full h-full
						flex place-content-center place-items-center
					">
						<CreateAccountButton call={() => toggleLightbox("createAccount", true)}/>
					</div>
				</footer>
	 			<div className="w-full h-full min-h-5 flex flex-1" />
			</section>
			{ showLightbox["info"] && <InfoLightbox dismiss={() => toggleLightbox("info", false)} /> }
			{ showLightbox["createAccount"] && <CreateAccountLightbox dismiss={() => toggleLightbox("createAccount", false)} /> }
			{ showLightbox["signIn"] && <SignInLightbox dismiss={() => toggleLightbox("signIn", false)} /> }
		</>
	);
}