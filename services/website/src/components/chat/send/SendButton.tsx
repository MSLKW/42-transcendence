import { Tooltip } from "../../../utilities/react/Tooltip";
import { SendIcon } from "./SendIcon";
import { MAX_MESSAGE_LENGTH } from "../../../store/ChatStore";
import { useUiSoundProps } from "../../../utilities/audio/useUiSoundProps";

interface SendButtonProps {
    message: string;
}
export const SendButton = ({ message }: SendButtonProps) => {
    return (
        <Tooltip text="Send Message">
            <button
                type="submit"
                disabled={!message.trim() || message.length > MAX_MESSAGE_LENGTH}
                {...useUiSoundProps()}
                className="btn-icon bg-accent"
            >
                <SendIcon />
            </button>
        </Tooltip>
    );
}