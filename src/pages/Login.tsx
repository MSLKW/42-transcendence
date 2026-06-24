import { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useDevStore } from "../store/useDevStore";
import { useSceneStore } from "../store/useSceneStore";
import { InfoButton, InfoLightbox } from "../components/Info";
import { CreateAccountButton, CreateAccountLightbox } from "../components/CreateAccount";
import { SignInButton, SignInLightbox } from "../components/SignIn";

export const Login = () => {
	const showStats = useDevStore((state) => state.showStats);
	const setContAreaWidth = useSceneStore((state) => state.setContAreaWidth);
	const setContAreaHeight = useSceneStore((state) => state.setContAreaHeight);
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
		<main>
			{ showStats && <div className="cont-three"><Canvas><Stats /></Canvas></div> }
			<section ref={containerRef} className="cont-area">
				<div className="z-0 flex flex-col w-full h-full">
					<div className="
						cont-row basis-12.5 shrink
						justify-end
						"
					>
						<InfoButton call={() => toggleLightbox("info", true)}/>
					</div>
					<div className="cont-row min-h-10 flex-3"/>
					<div className="
						basis-17.5 shrink
						flex flex-wrap
						justify-center items-center gap-5
						"
					>
						<SignInButton call={() => toggleLightbox("signIn", true)}/>
						{/* <button className="btn-text">SIGN IN</button> */}
						<button className="btn-text">PLAY AS GUEST</button>
					</div>
					<div className="
						cont-row basis-17.5 shrink
						flex justify-center items-center
						"
					>
						<CreateAccountButton call={() => toggleLightbox("createAccount", true)}/>
					</div>
					<div className="cont-row min-h-5 flex-1" />
				</div>
				{ showLightbox["info"] && <InfoLightbox dismiss={() => toggleLightbox("info", false)} /> }
				{ showLightbox["createAccount"] && <CreateAccountLightbox dismiss={() => toggleLightbox("createAccount", false)} /> }
				{ showLightbox["signIn"] && <SignInLightbox dismiss={() => toggleLightbox("signIn", false)} /> }
			</section>
		</main>
	);
}