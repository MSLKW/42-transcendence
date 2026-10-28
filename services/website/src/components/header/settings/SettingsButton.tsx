import { useSceneStore } from "../../../store/SceneStore";
import { SettingsIcon } from "./SettingsIcon";

export const SettingsButton = () => {
	return (
		<button
			type="button"
			data-tip="Settings"
			onClick={() => useSceneStore.getState().setShowWindow("settings", true)}
			className="btn-icon data-tip-down"
		>
			<SettingsIcon />
		</button>
	);
}
