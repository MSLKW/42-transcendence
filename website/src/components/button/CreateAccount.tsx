import { useSceneStore } from "../../store/SceneStore";

export const CreateAccountButton = () => {
	const setShowWindow =  useSceneStore((state) => state.setShowWindow);
	return (
		<button
			onClick={() => setShowWindow("createAccount", true)}
			className="
				hw-5/1
				rounded-full
				text-lg
				text-n6 hover:not-disabled:text-b5
				hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
				focus:outline-2
		">
			<u>CREATE ACCOUNT</u>
		</button>
	);
}