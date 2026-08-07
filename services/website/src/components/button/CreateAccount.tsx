import { useSceneStore } from "../../store/SceneStore";

export const CreateAccountButton = () => {
	const { showWindow, setShowWindow } =  useSceneStore();
	return (
		<button
			onClick={() => setShowWindow("createAccount", !showWindow.createAccount)}
			className="
				btn-text bg-light
				h-3rem aspect-6/1
				text-1.25rem text-n0
		">
			CREATE ACCOUNT
		</button>
	);
}