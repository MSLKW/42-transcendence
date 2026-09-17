import { useSceneStore } from "../../../store/SceneStore";
import { ChatIcon } from "./ChatIcon";

export const ChatButton = () => {
	const showWindow = useSceneStore((store) => store.showWindow);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);

	return (
		<button
			data-tip="Chat"
			onClick={() => setShowWindow("chat", !showWindow.chat)}
			className="
				btn-icon
				data-tip-down
			"
		>
			<ChatIcon />
		</button>
	);
}