import { useGameStore } from "../../../store/GameStore";

export const ResultsTotalModule = () => {
	const { totalPlayers } = useGameStore();

	return (
		<>
			<div className="
				row-start-1 row-end-1
				flex place-content-center place-items-center
				h-full w-full
				border-t border-n2/40
			">
				<h2>Total</h2>
			</div>
			<div className="
				row-start-2 row-end-2
				flex place-content-center place-items-center
				h-full w-full
				bg-b2 rounded-r-xl
			">
				<h3>5</h3>
			</div>
			<div className="
				row-start-3 row-end-3
				flex place-content-center place-items-center
				h-full w-full
			">
				<h3>10</h3>
			</div>
			{ totalPlayers >= 3 &&
				<div className="
					row-start-4 row-end-4
					flex place-content-center place-items-center
					h-full w-full
				">
					<h3>12</h3>
				</div>
			}
			{ totalPlayers >= 4 &&
				<div className="
					row-start-5 row-end-5
					flex place-content-center place-items-center
					h-full w-full
				">
					<h3>15</h3>
				</div>
			}
		</>
	);
}