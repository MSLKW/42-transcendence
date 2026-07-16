import { useSceneStore } from "../../store/SceneStore";
import { InfoIcon } from "../icon/Info";

export const InfoButton = () => {
	const setShowWindow = useSceneStore((scene) => scene.setShowWindow);

	return (
		<button
			data-tip="Info"
			onClick={() => setShowWindow("info", true)}
			className="
				btn-icon btn-tip-down
		">
			<InfoIcon />
		</button>
	)
}