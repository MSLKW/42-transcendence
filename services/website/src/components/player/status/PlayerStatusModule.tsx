import { usePartyStore, type AVAILABILITY_TYPE } from "../../../store/PartyStore";
import { Tooltip } from "../../../utilities/react/Tooltip";

interface PlayerStatusModuleProps {
	uuid: string;
	availability: AVAILABILITY_TYPE | null;
	lastOnline: Date | null;
}

export const PlayerStatusModule = ({ uuid, availability, lastOnline }: PlayerStatusModuleProps) => {
	const availabilityOverride = usePartyStore((store) => store.availabilityOverrides[uuid]);
	const effectiveAvailability = availabilityOverride ?? availability;

	return (
		<div className="
			h-full
			flex place-content-center place-items-center
			gap-0.5rem
		">
			<div className={`
				h-1rem aspect-square
				rounded-full
				${
					effectiveAvailability === "Offline" ? "bg-red-500" :
					effectiveAvailability === "Online" ? "bg-green-500" :
					"bg-yellow-500"
				}
			`}/>
			<h3 className="whitespace-nowrap">{effectiveAvailability ?? "n/a"}</h3>
			{effectiveAvailability === "Offline" &&
				<Tooltip text={`Last Online: ${lastOnline?.toLocaleString()}`}>
					<p className="
						h-2rem aspect-square
						rounded-full
						border border-n6 text-n6 opacity-60
						flex place-content-center place-items-center
					">
						❔
					</p>
				</Tooltip>
			}
		</div>
	);
}