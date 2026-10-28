import { useSceneStore } from "../../../store/SceneStore";

export const CreateAccountButton = () => {
	const showWindow =  useSceneStore((store) => store.showWindow);

	return (
		<button
			type="button"
			onClick={() => useSceneStore.getState().setShowWindow("createAccount", !showWindow.createAccount)}
			className="
				btn-text bg-light
				h-3rem aspect-6/1
				text-1.25rem text-n0
		">
			CREATE ACCOUNT
		</button>
	);
}