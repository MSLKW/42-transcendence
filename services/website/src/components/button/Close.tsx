import { CloseIcon } from "../icon/Close";

interface CloseButtonProps {
	dismiss?: () => void;
}

export const CloseButton = ({ dismiss }: CloseButtonProps) => {
	return (
		<button
			data-tip="Close"
			onClick={dismiss}
			className="btn-icon btn-icon-border btn-tip-down"
		>
				<CloseIcon />
		</button>
	);
}