import { useSceneStore } from "../../store/SceneStore";
import { ChatIcon } from "../icon/Chat";

export const ChatButton = () => {
	const setShowWindow = useSceneStore((scene) => scene.setShowWindow);

	return (
		<button
			data-tip="Chat"
			onClick={() => setShowWindow("chat", true)}
			className="
				btn-icon
				btn-tip-down
			"
		>
			<ChatIcon />
		</button>
	);
}