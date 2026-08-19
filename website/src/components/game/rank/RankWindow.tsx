import { Window } from "../../window/Window";
import { RankLongArrowIcon } from "./RankLongArrowIcon";
import { HAND_LABEL, useGameStore } from "../../../store/GameStore";
import { GameSuitHeartsIcon } from "./suits/GameSuitHeartsIcon"
import { GameSuitDiamondsIcon } from "./suits/GameSuitDiamondsIcon"
import { GameSuitSpadesIcon } from "./suits/GameSuitSpadesIcon"
import { GameSuitClubsIcon } from "./suits/GameSuitClubsIcon"

export const RankWindow = () => {
	const { currentHand } = useGameStore();

	return (
		<Window
			title={`Rank`}
			dismissKey="rank"
			pinState={false}
		>
			<div className="flex">
				<div className="
					px-1.5rem py-2rem mr-5
					flex gap-1rem
					rounded-bl-xl
				">
					<div
						className="
							flex place-items-center
							text-b5
						"
					>
						<RankLongArrowIcon />
					</div>
					<div
						className="
							flex flex-col
							gap-1rem
							text-n6 text-right whitespace-nowrap
						"
					>
						{ HAND_LABEL.map((hand) => (
							<h3
								key={hand}
								className={currentHand === hand ? "text-b5" : ""}
							>
								{hand}
							</h3>
						))}
					</div>
				</div>
				<div
					className="
						px-1.5rem py-2rem
						flex gap-1rem
						bg-n6
						rounded-br-xl
					"
				>
					<div className="
						flex flex-col place-content-between
					">
						<GameSuitSpadesIcon />
						<GameSuitHeartsIcon />
						<GameSuitClubsIcon />
						<GameSuitDiamondsIcon />
					</div>
					<div className="
						flex place-items-center
						text-b3
					">
						<RankLongArrowIcon />
					</div>
				</div>
			</div>
		</Window>
	);
}