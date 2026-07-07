import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useDevStore } from "../store/useDevStore";

export const Gameplay = () => {
	const showStats = useDevStore((state) => state.showStats);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	}, []);
	
	return (
		<section className="h-full">
			<span className="
				text-[clamp(8rem,11.429vmin+5.714rem,16rem)]
				font-extrabold
				text-n6
			">
				Gameplay
			</span>
		</section>
	);
}