import { useDevStore } from "../store/useDevStore";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";

export const Login = () => {
	const showFrame = useDevStore((state) => state.showFrame);
	const showStats = useDevStore((state) => state.showStats);
	
	return (
		<section className={`canvas-screen ${showFrame ? "border" : ""}`}>
			{showStats && <div className="canvas-three"><Canvas><Stats /></Canvas></div>}
			<h1>Login</h1>
		</section>
	);
}