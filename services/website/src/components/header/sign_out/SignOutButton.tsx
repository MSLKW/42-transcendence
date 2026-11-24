import { useSceneStore } from "../../../store/SceneStore";
import { Tooltip } from "../../../utilities/react/Tooltip";
import { useUiSoundProps } from "../../../utilities/react/useUiSoundProps";
import { SignOutIcon } from "./SignOutIcon";

export const SignOutButton = () => {
	return (
		<button
			type="button"
			{...useUiSoundProps()}
			onClick={() => useSceneStore.getState().setShowWindow("leave", true)}
			className="btn-icon"
		>
			<Tooltip text="Sign out" position="bottom">
				<SignOutIcon />
			</Tooltip>
		</button>
	);
}