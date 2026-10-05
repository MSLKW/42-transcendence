import { Tooltip } from "../../../utilities/react/Tooltip";
import { HostIcon } from "../host/HostIcon";

interface AvatarCornerButtonProps {
	cornerButton?: string | number;
}

export const AvatarCornerButton = ({ cornerButton }: AvatarCornerButtonProps) => {
	return (
		<>
			{ cornerButton === "host" &&
				<div className="
					bg-dark bg-n0/80 border-n1 rounded-full
					h-3rem aspect-square
					absolute top-0 -translate-y-1/2 right-0 translate-x-1/2
					text-a4
					cursor-help
				">
					<Tooltip text="Host">
						<HostIcon />
					</Tooltip>
				</div>
			}
			{ typeof cornerButton === "number" &&
				<div className="
					bg-dark bg-n0/80 border-n1 rounded-full
					h-3rem aspect-square
					absolute top-0 -translate-y-1/2 right-0 translate-x-1/2
					text-n6
					flex place-content-center place-items-center
					cursor-help
				">
					<Tooltip text="Cards Left">
						<p>{cornerButton}</p>
					</Tooltip>
				</div>
			}
			{ (cornerButton === "1st" || cornerButton === "2nd" || cornerButton === "3rd" || cornerButton === "4th") &&
				<div className={`
					absolute top-0 -translate-y-1/2 right-0 translate-x-1/2
					${cornerButton === "1st" ? "bg-accent text-n0" : "bg-dark bg-n0/80 border-n1 text-n6" }
					h-3rem aspect-square
					rounded-full
					text-n0
					flex place-content-center place-items-center
					cursor-help
				`}>
					<Tooltip text={cornerButton + " Place"}>
						<p>{cornerButton}</p>
					</Tooltip>
				</div>
			}
		</>
	);
}