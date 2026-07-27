import { useSceneStore } from "../../store/SceneStore";
import { ChatIcon } from "../icon/Chat";

export const ChatButton = () => {
	const { showWindow, setShowWindow } = useSceneStore();

	return (
		<button
			data-tip="Chat"
			onClick={() => setShowWindow("chat", !showWindow.chat)}
			className="
				btn-icon
				btn-tip-down
			"
		>
			<ChatIcon />
		</button>
	);
}