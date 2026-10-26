import { Tooltip } from "../../../utilities/react/Tooltip";
import { EmojiIcon } from "./EmojiIcon";

export const EmoteHover = () => {
	const handleSend = (e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e)
			e.currentTarget.blur();
	}

	return (
		<button
			onClick={(e) => {handleSend(e)}}
			className="btn-icon"
		>
			<Tooltip text="Emote" position="left">
				<EmojiIcon />
			</Tooltip>
		</button>
	);
}