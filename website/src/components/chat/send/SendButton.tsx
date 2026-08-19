import { SendIcon } from "./SendIcon";

export const SendButton = () => {
    const handleSend = (e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e)
			e.currentTarget.blur();
	}

    return (
        <button
            data-tip="Send"
            className="btn-icon bg-accent data-tip-up"
            onClick={(e) => {handleSend(e)}}
        >
            <SendIcon />
        </button>
    );
}