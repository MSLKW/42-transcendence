import { useSceneStore } from "../../../store/SceneStore";
import { Tooltip } from "../../../utilities/react/Tooltip";
import { SignOutIcon } from "./SignOutIcon";

export const SignOutButton = () => {
	return (
		<button
			onClick={() => useSceneStore.getState().setShowWindow("leave", true)}
			className="btn-icon"
		>
			<Tooltip text="Sign out" position="bottom">
				<SignOutIcon />
			</Tooltip>
		</button>
	);
}