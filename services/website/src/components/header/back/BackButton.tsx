import { Tooltip } from "../../../utilities/react/Tooltip";
import { BackIcon } from "./BackIcon";

interface BackButtonProps {
	scene?: () => void;
}

export const BackButton = ({ scene }: BackButtonProps) => {
	return (
		<button
			onClick={scene}
			className="btn-icon"
		>
			<Tooltip text="Back" position="bottom">
				<BackIcon />
			</Tooltip>
		</button>
	);
}