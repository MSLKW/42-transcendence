import { useSceneStore } from "../../../store/SceneStore";

export const SignInButton = () => {
	const showWindow = useSceneStore((store) => store.showWindow);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);

	return (
		<button
			onClick={() => setShowWindow("signIn", !showWindow.signIn)}
			className="
				btn-text bg-light
				h-3rem aspect-6/1
				text-1.25rem text-n0
		">
			SIGN IN
		</button>
	);
}