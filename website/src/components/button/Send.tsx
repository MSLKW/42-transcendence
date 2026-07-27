import { SendIcon } from "../icon/Send";

export const SendButton = () => {
    const handleSend = (e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e)
			e.currentTarget.blur();
	}

    return (
        <button
            data-tip="Send"
            className="btn-icon bg-b5 btn-icon-border data-tip-up"
            onClick={(e) => {handleSend(e)}}
        >
            <SendIcon />
        </button>
    );
}