import { BackIcon } from "./BackIcon";

interface BackButtonProps {
	scene?: () => void;
}

export const BackButton = ({ scene }: BackButtonProps) => {
	return (
		<button
			data-tip="Back"
			onClick={scene}
			className="btn-icon data-tip-down"
		>
			<BackIcon />
		</button>
	);
}