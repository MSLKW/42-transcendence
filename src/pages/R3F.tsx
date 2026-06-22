import { useDevStore } from "../store/useDevStore";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";

export const R3F = () => {
	const showFrame = useDevStore((state) => state.showFrame);
	const showStats = useDevStore((state) => state.showStats);
	
	return (
		<section className={`canvas-screen ${showFrame ? "border" : ""}`}>
			{showStats && <div className="canvas-three"><Canvas><Stats /></Canvas></div>}
			<h1>R3F</h1>
		</section>
	);
}