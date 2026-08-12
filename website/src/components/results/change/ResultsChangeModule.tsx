
import { useGameStore } from "../../../store/GameStore";
import { RedTriangle } from "../triangle/RedTriangle";
import { GreenTriangle } from "../triangle/GreenTriangle";

export const ResultsChangeModule = () => {
	const { totalPlayers } = useGameStore();
	
	return (
		<>
			<div className="
				row-start-1 row-end-1
				flex place-content-center place-items-center
				h-full w-full
				border-t border-r border-n2/40
			">
				<h2>Change</h2>
			</div>
			<div className="
				row-start-2 row-end-2
				flex place-content-center place-items-center
				h-full w-full
				bg-b2
				border-r border-n2/40
			">
				<GreenTriangle />
			</div>
			<div className="
				row-start-3 row-end-3
				flex place-content-center place-items-center
				h-full w-full
				border-r border-n2/40
			">
				<GreenTriangle />
			</div>
			{ totalPlayers >= 3 &&
				<div className="
					row-start-4 row-end-4
					flex place-content-center place-items-center
					h-full w-full
					border-r border-n2/40
				">
					<RedTriangle />
				</div>
			}
			{ totalPlayers >= 4 &&
				<div className="
					row-start-5 row-end-5
					flex place-content-center place-items-center
					h-full w-full
					border-r border-n2/40
				">
					<RedTriangle />
				</div>
			}
		</>
	);
}