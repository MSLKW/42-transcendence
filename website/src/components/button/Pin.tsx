import { PinIcon } from "../icon/Pin";

export const PinButton = () => {
    return (
        <button
            data-tip="Pin Window"
            className="btn-icon btn-icon-border btn-tip-down"
        >
            <PinIcon />
        </button>
    );
}