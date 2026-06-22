import { useDevStore } from "../store/useDevStore";

export const Lobby = () => {
	const showFrame = useDevStore((state) => state.showFrame);

	return (
		<section className={`canvas-screen ${showFrame ? "border" : ""}`}>
			<h1>Lobby</h1>
		</section>
	);
}