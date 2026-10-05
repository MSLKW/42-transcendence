import { Tooltip } from "../../../utilities/react/Tooltip";
import { SendIcon } from "./SendIcon";

interface SendButtonProps {
    message: string;
}
export const SendButton = ({ message }: SendButtonProps) => {
    return (
        <Tooltip text="Send Message">
            <button
                type="submit"
                disabled={message.length === 0}
                className="btn-icon bg-accent"
            >
                <SendIcon />
            </button>
        </Tooltip>
    );
}