export const statusType = {
	"offline": 0,
	"online": 1,
	"unavailable": 2,
} as const;

interface PlayerStatusModuleProps {
	status: number;
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
						status === statusType.offline ? "bg-red-500" :
						status === statusType.online ? "bg-green-500" :
						"bg-yellow-500"
					}
				`}
			/>
			<p>
				{
					status === statusType.offline ? "Offline" :
					status === statusType.online ? "Online" :
					"In another party"
				}
			</p>
		</div>
	);
}