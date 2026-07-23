import { useSceneStore } from "../../store/SceneStore";
import { SettingsIcon } from "../icon/Settings";

export const SettingsButton = () => {
	const { setShowWindow } = useSceneStore();

	return (
		<button data-tip="Settings"
			onClick={() => setShowWindow("settings", true)}
			className="btn-icon btn-tip-down"
		>
			<SettingsIcon />
		</button>
	);
}
