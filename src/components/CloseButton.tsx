import { CloseIcon } from "../icons/CloseIcon";

interface CloseButtonProps {
	dismiss?: () => void;
}

export const CloseButton = ({ dismiss }: CloseButtonProps) => {
	return (
		<button
			data-tip="Close"
			onClick={dismiss}
			className="
				btn-icon
				bg-n1
				border border-n2
			"
		>
				<CloseIcon />
		</button>
	);
}