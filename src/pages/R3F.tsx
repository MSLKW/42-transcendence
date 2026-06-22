import { useDevStore } from "../store/useDevStore";

export const R3F = () => {
	const showFrame = useDevStore((state) => state.showFrame);
	
	return (
		<section className={`canvas-screen ${showFrame ? "border" : ""}`}>
			<h1>R3F</h1>
		</section>
	);
}