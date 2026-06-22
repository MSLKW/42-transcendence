import { useDevStore } from "../store/useDevStore";

export const Gameplay = () => {
	const showFrame = useDevStore((state) => state.showFrame);
	
	return (
		<section className={`canvas-screen ${showFrame ? "border" : ""}`}>
			<h1>Gameplay</h1>
		</section>
	);
}