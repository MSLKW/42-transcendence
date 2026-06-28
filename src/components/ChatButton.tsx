import { ChatIcon } from "../icons/ChatIcon";

export const ChatButton = () => {
    return (
        <button
            data-tip="Chat"
            className="btn-icon btn-icon-border btn-tip-up"
        >
            <ChatIcon />
        </button>
    );
}