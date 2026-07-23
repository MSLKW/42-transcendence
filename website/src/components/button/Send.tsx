import { SendIcon } from "../icon/Send";

export const SendButton = () => {
    const handleSend = (e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e)
			e.currentTarget.blur();
	}

    return (
        <button
            data-tip="Send"
            className="btn-icon h-9 bg-b5 btn-icon-border btn-tip-up"
            onClick={(e) => {handleSend(e)}}
        >
            <SendIcon />
        </button>
    );
}