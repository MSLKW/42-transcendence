import { useSceneStore } from "../../../store/SceneStore";
import { Tooltip } from "../../../utilities/react/Tooltip";
import { ChatIcon } from "./ChatIcon";

export const ChatButton = () => {
	const showWindow = useSceneStore((store) => store.showWindow);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);

	return (
		<button
			onClick={() => setShowWindow("chat", !showWindow.chat)}
			className="btn-icon"
		>
			<Tooltip text="Chat" position="bottom">
				<ChatIcon />
			</Tooltip>
		</button>
	);
}