import { SendIcon } from "./SendIcon";

interface SendButtonProps {
    message: string;
}
export const SendButton = ({ message }: SendButtonProps) => {
    return (
        <button
            type="submit"
            disabled={message.length === 0}
            data-tip="Send Message"
            className="btn-icon bg-accent data-tip-up"
        >
            <SendIcon />
        </button>
    );
}