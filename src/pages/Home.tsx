import { useDevStore } from "../store/useDevStore";

export const Home = () => {
	const showFrame = useDevStore((state) => state.showFrame);
	
	return (
		<section className={`canvas-screen ${showFrame ? "border" : ""}`}>
			<h1>Home</h1>
		</section>
	);
}