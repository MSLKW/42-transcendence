import { useDevStore } from "../store/useDevStore";

export const Login = () => {
	const showFrame = useDevStore((state) => state.showFrame);
	
	return (
		<section className={`canvas-screen ${showFrame ? "border" : ""}`}>
			<h1>Login</h1>
		</section>
	);
}