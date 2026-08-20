import { useBotStore } from "../../../store/BotStore";
import { useGameStore } from "../../../store/GameStore";
import { AvatarName } from "../../avatar/name/AvatarName";
import { AddBotsIcon } from "./AddBotsIcon";
import { RemoveBotsIcon } from "./RemoveBotsIcon";

export const BotManagerButton = () => {
	const { fillSeatsWithBots, removeBots, botCount } = useBotStore();
	const handleBotCount = (e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e)
			e.currentTarget.blur();
		if (botCount === 0)
			fillSeatsWithBots();
		else
			removeBots();
	}
	const { seats } = useGameStore();
	const humansSeated = seats.filter((seat): seat is string => seat !== null && !seats.includes("bot")).length;

	return (
		<div
			className="
				flex flex-col place-content-center place-items-center
				gap-0.75rem
			"
		>
			<button 
				data-tip={botCount === 0 ? "Fill With Bots" : "Remove All Bots"}
				disabled={humansSeated <= 0}
				onClick={(e) => {handleBotCount(e)}}
				className="
					h-6rem aspect-square
					bg-dark btn-icon rounded-sm
					data-tip-up
					flex place-content-center place-items-center
				"
			>
				{ botCount === 0 ? <AddBotsIcon /> : <RemoveBotsIcon /> }
			</button>
			<AvatarName name="Bots" style="seat"/>
		</div>
	);
}