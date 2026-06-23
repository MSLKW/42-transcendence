import { useDevStore } from "../store/useDevStore";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";

export const Login = () => {
	const showFrame = useDevStore((state) => state.showFrame);
	const showStats = useDevStore((state) => state.showStats);
	
	return (
		<section className={`cont-area ${showFrame ? "border" : ""}`}>
			{showStats && <div className="cont-three"><Canvas><Stats /></Canvas></div>}
			<div className="flex flex-col w-full h-full">
				<div className={`cont-row basis-12.5 shrink justify-end ${showFrame ? "border" : ""}`}>
					<button className="btn-icon"></button>
				</div>
				<div className={`cont-row flex-1 ${showFrame ? "border" : ""}`}>
				</div>
				<div className={`cont-row basis-12.5 shrink ${showFrame ? "border" : ""}`}>
				</div>
				<div className={`cont-row basis-12.5 shrink ${showFrame ? "border" : ""}`}>
				</div>
			</div>
		</section>
	);
}