import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useDevStore } from "../store/useDevStore";

export const Home = () => {
	const showStats = useDevStore((state) => state.showStats);
	
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	}, []);
	
	return (
		<section className="cont-area">
			{showStats && <div className="cont-three"><Canvas><Stats /></Canvas></div>}
			<h1>Home</h1>
		</section>
	);
}