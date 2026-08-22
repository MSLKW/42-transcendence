import { useBotStore } from "../../../store/BotStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { useSceneStore } from "../../../store/SceneStore";
import { autoPassKeys, useSettingsStore } from "../../../store/SettingsStore";

export const HostSettings = () => {
	const { allow3OfAKind, allow2OfSpadesEnd, autoPassIndex, endGameCondition, scoreCalculation } = useSettingsStore();
	const { currentIntel, botCount } = useBotStore();
	const { hostUuid } = usePartyStore();
	const { clientUuid } = useProfileStore();
	const { setShowWindow } = useSceneStore();

	return (
		<button
			tabIndex={-1}
			data-tip={clientUuid === hostUuid ? "Edit rules" : "Rules set by host"}
			onClick={
				clientUuid === hostUuid
					? () => setShowWindow("settings", true)
					: undefined
			}
			className={`
				w-max
				bg-n1/50 rounded-xl
				py-1.5rem px-2rem
				text-n6/80
				flex flex-col gap-1rem
				${ clientUuid === hostUuid ? "hover:not-disabled:scale-105 cursor-pointer" : ""}
				data-tip-up
			`}
		>
			<h1>Lobby Rules</h1>
			<div>
				<h3><b>Play Three of a Kind?</b></h3>
				<h3 className="text-a4">
					{ allow3OfAKind ? "Yes" : "No" }
				</h3>
			</div>
			<div>
				<h3><b>Finish with 2 of Spades?</b></h3>
				<h3 className="text-a4">
					{ allow2OfSpadesEnd ? "Yes": "No" }
				</h3>
			</div>
			<div>
				<h3><b>Auto Pass Time:</b></h3>
				<h3 className="text-a4">
					{ autoPassKeys[autoPassIndex] }
				</h3>
			</div>
			<div>
				<h3><b>End Game Condition:</b></h3>
				<h3 className="text-a4">
					{ endGameCondition ? "When first player finish" : "Until last hand remain" }
				</h3>
			</div>
			<div>
				<h3><b>Score Calculation:</b></h3>
				<h3 className="text-a4">
					{ scoreCalculation ? "Number of cards" : "Value of cards" }
				</h3>
			</div>
			{ botCount > 0 &&
				<div>
					<h3><b>Bot Difficulty:</b></h3>
					<h3 className="text-a4">
						{ currentIntel }
					</h3>
				</div>
			}
		</button>
	);
}