import { useSceneStore } from "../../../store/SceneStore";
import { SettingsIcon } from "./SettingsIcon";

export const SettingsButton = () => {
	const { setShowWindow } = useSceneStore();

	return (
		<button data-tip="Settings"
			onClick={() => setShowWindow("settings", true)}
			// onClick={() => console.log("setShowWindow")}
			className="btn-icon data-tip-down"
		>
			<SettingsIcon />
		</button>
	);
}
