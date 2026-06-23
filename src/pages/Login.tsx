import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useDevStore } from "../store/useDevStore";
import { Info } from "../icons/Info";

export const Login = () => {
	const showFrame = useDevStore((state) => state.showFrame);
	const showStats = useDevStore((state) => state.showStats);

	useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth', })}, []);
	
	return (
		<section className={`cont-area ${showFrame ? "border" : ""}`}>
			{showStats && <div className="cont-three"><Canvas><Stats /></Canvas></div>}
			<div className="flex flex-col w-full h-full">
				<div className={`
					cont-row basis-12.5 shrink ${showFrame ? "border" : ""}
					justify-end
				`}>
					<button className="btn-icon" data-tip="Info"><Info /></button>
				</div>
				<div className={`cont-row min-h-10 flex-3 ${showFrame ? "border" : ""}`}/>
				<div className={`cont-row basis-17.5 shrink flex justify-center items-center gap-5 ${showFrame ? "border" : ""}`}>
					<button className="btn-text">SIGN IN</button>
					<button className="btn-text">PLAY AS GUEST</button>
				</div>
				<div className={`cont-row basis-17.5 shrink flex justify-center items-center ${showFrame ? "border" : ""}`}>
					<button className={`btn-clear ${showFrame ? "border" : ""}`}><u>CREATE ACCOUNT</u></button>
				</div>
				<div className={`cont-row min-h-5 flex-1 ${showFrame ? "border" : ""}`} />
			</div>
		</section>
	);
}