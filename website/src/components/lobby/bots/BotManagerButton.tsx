import { useBotStore } from "../../../store/BotStore";
import { AvatarName } from "../../avatar/name/AvatarName";
import { AddBotsIcon } from "./AddBotsIcon";
import { RemoveBotsIcon } from "./RemoveBotsIcon";

export const BotManagerButton = () => {
	const { fillSeatsWithBots, removeBotsFromParty, botCount } = useBotStore();
	const handleBotCount = (e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e)
			e.currentTarget.blur();
		if (botCount === 0)
			fillSeatsWithBots();
		else
			removeBotsFromParty();
	}

	return (
		<div
			className="
				flex flex-col place-content-center place-items-center
				gap-0.75rem
			"
		>
			<button 
				data-tip={botCount === 0 ? "Fill With Bots" : "Remove All Bots"}
				onClick={(e) => {handleBotCount(e)}}
				className="
					rounded-xs
					hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
					focus-visible:outline-2 outline-b5
					data-tip-up
					cursor-pointer
				"
			>
				<div
					className="
						h-[clamp(2.5rem,7.5vh+0.5rem,5rem)] aspect-square
						bg-dark rounded-sm
						flex place-content-center place-items-center
				">
					{ botCount === 0 ? <AddBotsIcon /> : <RemoveBotsIcon /> }
				</div>
			</button>
			<AvatarName name="Bots" style="seat"/>
		</div>
	);
}