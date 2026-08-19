import { useSceneStore } from "../../../store/SceneStore";

export const SignInButton = () => {
	const { showWindow, setShowWindow } = useSceneStore();

	return (
		<button
			onClick={() => setShowWindow("signIn", !showWindow.signIn)}
			className="
				btn-text bg-light
				h-3rem aspect-6/1
				text-1.25rem text-n0
			"
		>
			SIGN IN
		</button>
	);
}