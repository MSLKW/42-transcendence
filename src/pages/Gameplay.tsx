import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";

export const Gameplay = () => {
	const setGameStarted = useGameStore((state) => state.setGameStarted);
	useEffect(() => {
		setGameStarted(true);
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