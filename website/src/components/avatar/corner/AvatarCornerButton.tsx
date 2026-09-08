import { HostIcon } from "../host/HostIcon";
import { usePartyStore } from "../../../store/PartyStore";

interface AvatarCornerButtonProps {
	cornerButton?: string | number;
}

export const AvatarCornerButton = ({ cornerButton }: AvatarCornerButtonProps) => {
	const partySize = usePartyStore.getState().members.length;
	
	return (
		<>
			{ cornerButton === "host" && partySize > 1 &&
				<div
					data-tip="Host"
					className="
						bg-dark bg-n0/80 border-n1 rounded-full
						h-3rem aspect-square
						data-tip-down
						absolute top-0 -translate-y-1/2 right-0 translate-x-1/2
						text-a4
						cursor-help
					"
				>
					<HostIcon />
				</div>
			}
			{ typeof cornerButton === "number" &&
				<div
					data-tip="Cards Left"
					className="
						bg-dark bg-n0/80 border-n1 rounded-full
						h-3rem aspect-square
						absolute top-0 -translate-y-1/2 right-0 translate-x-1/2
						text-n6
						flex place-content-center place-items-center
						data-tip-down
						cursor-help
					"
				>
					<p>{cornerButton}</p>
				</div>
			}
			{ (cornerButton === "1st" || cornerButton === "2nd" || cornerButton === "3rd" || cornerButton === "4th") &&
				<div
					data-tip={cornerButton + " Place"}
					className={`
						absolute top-0 -translate-y-1/2 right-0 translate-x-1/2
						${cornerButton === "1st" ? "bg-accent text-n0" : "bg-dark bg-n0/80 border-n1 text-n6" }
						h-3rem aspect-square
						rounded-full
						text-n0
						flex place-content-center place-items-center
						cursor-help
						data-tip-down
					`}
				>
					<p>{cornerButton}</p>
				</div>
			}
		</>
	);
}