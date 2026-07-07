import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, PerspectiveCamera, OrbitControls, AdaptiveDpr } from "@react-three/drei";
import { useSceneStore } from "../store/useSceneStore";
import { useDevStore } from "../store/useDevStore";
import { StripeBg } from "../components/StripeBg";
import { SphereBg } from "../components/SphereBg";
import { BigLogo } from "../components/Logo";
import { InfoButton, InfoLightbox } from "../components/Info";
import { CreateAccountButton, CreateAccountLightbox } from "../components/CreateAccount";
import { SignInButton, SignInLightbox } from "../components/SignIn";
import { Card } from "../components/Card";

export const Login = () => {
	const setCurrentScene = useSceneStore((state) => state.setCurrentScene);
	const setContAreaWidth = useSceneStore((state) => state.setContAreaWidth);
	const setContAreaHeight = useSceneStore((state) => state.setContAreaHeight);
	const showStats = useDevStore((state) => state.showStats);
	const containerRef = useRef(null);
	const [showLightbox, setShowLightbox] = useState({
		info: false,
		signIn: true,
		createAccount: false,
	});
	const toggleLightbox = (key: keyof typeof showLightbox, value: boolean, e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e)
			e.currentTarget.blur();
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
					{/* <SphereBg /> */}
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
						<InfoButton call={(e) => toggleLightbox("info", true, e)}/>
					</div>
				</header>
				{/* <header className="flex"> */}
					{/* <div className="flex bg-n1 border border-n2 rounded-3xl"> */}
						{/* <InfoButton call={(e) => toggleLightbox("info", true, e)}/> */}
					{/* </div> */}
				{/* </header> */}
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
						<SignInButton call={(e) => toggleLightbox("signIn", true, e)}/>
						<button onClick={() => setCurrentScene("HOME")} className="btn-white">PLAY AS GUEST</button>
					</div>
					<CreateAccountButton call={(e) => toggleLightbox("createAccount", true, e)}/>
				</footer>
				<div className="h-[clamp(0rem,30.769vh-9.231rem,10rem)]"/>
				{/* <div className="h-1/7"/> */}
			</section>
			{ showLightbox["info"] && <InfoLightbox dismiss={() => toggleLightbox("info", false)} /> }
			{ showLightbox["createAccount"] && <CreateAccountLightbox dismiss={() => toggleLightbox("createAccount", false)} /> }
			{ showLightbox["signIn"] && <SignInLightbox dismiss={() => toggleLightbox("signIn", false)} /> }
		</>
	);
}