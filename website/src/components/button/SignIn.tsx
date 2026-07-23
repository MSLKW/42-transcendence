import { useSceneStore } from "../../store/SceneStore";

export const SignInButton = () => {
	const setShowWindow = useSceneStore((scene) => scene.setShowWindow);

	return (
		<button
			onClick={() => setShowWindow("signIn", true)}
			className="btn-white hw-5/1"
		>
			SIGN IN
		</button>
	);
}