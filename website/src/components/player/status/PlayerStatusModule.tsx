import type { AVAILABILITY_TYPE } from "../../../store/PartyStore";

interface PlayerStatusModuleProps {
	status: AVAILABILITY_TYPE | null;
	lastOnline: Date | null;
}

export const PlayerStatusModule = ({ status, lastOnline }: PlayerStatusModuleProps) => {
	return (
		<div
			data-tip={`Last Online: ${lastOnline?.toLocaleString()}`}
			className="
				h-full
				flex place-content-center place-items-center
				gap-0.5rem
				data-tip-up
			"
		>
			<div
				className={`
					h-1rem aspect-square
					rounded-full
					${
						status === "Offline" ? "bg-red-500" :
						status === "Online" ? "bg-green-500" :
						"bg-yellow-500"
					}
				`}
			/>
			<h3 className="whitespace-nowrap">{status ?? "n/a"}</h3>
		</div>
	);
}