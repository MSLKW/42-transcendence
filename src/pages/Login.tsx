import { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useDevStore } from "../store/useDevStore";
import { useSceneStore } from "../store/useSceneStore";
import { InfoButton, InfoLightbox } from "../components/Info";

export const Login = () => {
	const showFrame = useDevStore((state) => state.showFrame);
	const showStats = useDevStore((state) => state.showStats);
	const setContAreaWidth = useSceneStore((state) => state.setContAreaWidth);
	const setContAreaHeight = useSceneStore((state) => state.setContAreaHeight);
	const containerRef = useRef(null);
	const [showPopWindow, setShowPopWindow] = useState({
		info: true,
		signIn: false,
		createAccount: false,
	});

	const togglePopWindow = (key: keyof typeof showPopWindow, value: boolean) => {
		setShowPopWindow(() => ({
			...showPopWindow,
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
		<section ref={containerRef} className={`cont-area ${showFrame ? "border" : ""}`}>
			{ showStats && <div className="cont-three"><Canvas><Stats /></Canvas></div> }
			<div className="z-0 flex flex-col w-full h-full">
				<div className={`
					cont-row basis-12.5 shrink ${showFrame ? "border" : ""}
					justify-end
				`}>
					<InfoButton call={() => togglePopWindow('info', true)}/>
				</div>
				<div className={`cont-row min-h-10 flex-3 ${showFrame ? "border" : ""}`}/>
				<div className={`cont-row basis-17.5 shrink flex flex-wrap justify-center items-center gap-5 ${showFrame ? "border" : ""}`}>
					<button className="btn-text">SIGN IN</button>
					<button className="btn-text">PLAY AS GUEST</button>
				</div>
				<div className={`cont-row basis-17.5 shrink flex justify-center items-center ${showFrame ? "border" : ""}`}>
					<button className={`btn-clear ${showFrame ? "border" : ""}`}><u>CREATE ACCOUNT</u></button>
				</div>
				<div className={`cont-row min-h-5 flex-1 ${showFrame ? "border" : ""}`} />
			</div>
			{ showPopWindow["info"] && <InfoLightbox dismiss={() => togglePopWindow('info', false)} /> }
		</section>
	);
}