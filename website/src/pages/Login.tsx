import { useRef, useEffect } from "react";
import { useSceneStore } from "../store/SceneStore";
import { BigLogo } from "../components/image/Logo";
import { InfoButton } from "../components/Info";
import { CreateAccountButton } from "../components/CreateAccount";
import { SignInButton } from "../components/SignIn";

export const Login = () => {
	const setCurrentScene = useSceneStore((state) => state.setCurrentScene);
	const setContAreaWidth = useSceneStore((state) => state.setContAreaWidth);
	const setContAreaHeight = useSceneStore((state) => state.setContAreaHeight);
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
			<main className="
				absolute top-0
				flex place-content-center
				pointer-events-none
			">
				<BigLogo />
			</main>
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
						<button onClick={() => setCurrentScene("HOME")} className="btn-white hw-5/1">PLAY AS GUEST</button>
					</div>
					<CreateAccountButton />
				</footer>
				<div className="h-[clamp(0rem,30.769vh-9.231rem,10rem)]"/>
			</section>
		</>
	);
}