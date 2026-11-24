import { Tooltip } from "../../../utilities/react/Tooltip";
import { useUiSoundProps } from "../../../utilities/react/useUiSoundProps";
import { EmojiIcon } from "./EmojiIcon";

interface EmoteHoverProps {
	isOpen: boolean;
	toggleOpen: () => void;
}

export const EmoteHover = ({ isOpen, toggleOpen }: EmoteHoverProps) => {

	return (
		<button
			type="button"
			{...useUiSoundProps({ keyDown: false, keyUp: false })}
			aria-expanded={isOpen}
			aria-haspopup="true"
			onClick={toggleOpen}
			className="btn-icon"
		>
			<Tooltip text="Emote" position="left">
				<EmojiIcon />
			</Tooltip>
		</button>
	);
}
