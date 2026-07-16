import { useSceneStore } from "../../store/SceneStore";

export const CreateAccountButton = () => {
	const setShowWindow =  useSceneStore((state) => state.setShowWindow);
	return (
		<button
			onClick={() => setShowWindow("createAccount", true)}
			className="btn-clear hw-5/1"
		>
			<u>CREATE ACCOUNT</u>
		</button>
	);
}