import type { AVAILABILITY_TYPE } from "../../../store/ProfileStore";

interface PlayerStatusModuleProps {
	status: AVAILABILITY_TYPE;
}
export const PlayerStatusModule = ({ status }: PlayerStatusModuleProps) => {
	return (
		<div
			className="
				h-full
				flex place-content-center place-items-center
				gap-0.5rem
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
			<h3 className="whitespace-nowrap">
				{
					status === "Offline" ? "Offline" :
					status === "Online" ? "Online" :
					"In another party"
				}
			</h3>
		</div>
	);
}