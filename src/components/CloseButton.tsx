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
				absolute z-1 top-0 right-0 -translate-x-10 translate-y-10
				bg-n1
				border border-n2
			"
		>
				<CloseIcon />
		</button>
	);
}