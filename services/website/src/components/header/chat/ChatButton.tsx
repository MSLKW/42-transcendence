import { useSceneStore } from "../../../store/SceneStore";
import { Tooltip } from "../../../utilities/react/Tooltip";
import { useUiSoundProps } from "../../../utilities/audio/useUiSoundProps";
import { ChatIcon } from "./ChatIcon";

export const ChatButton = () => {
	const showWindow = useSceneStore((store) => store.showWindow);

	return (
		<button
			type="button"
			{...useUiSoundProps()}
			onClick={() => useSceneStore.getState().setShowWindow("chat", !showWindow.chat)}
			className="btn-icon"
		>
			<Tooltip text="Chat" position="bottom">
				<ChatIcon />
			</Tooltip>
		</button>
	);
}