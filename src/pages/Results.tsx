import { useDevStore } from "../store/useDevStore";

export const Results = () => {
	const showFrame = useDevStore((state) => state.showFrame);
	
	return (
		<section className={`canvas-screen ${showFrame ? "border" : ""}`}>
			<h1>Results</h1>
		</section>
	);
}