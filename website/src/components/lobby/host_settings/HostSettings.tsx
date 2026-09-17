import { useAuthStore } from "../../../store/AuthStore";
import { useBotStore } from "../../../store/BotStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useSceneStore } from "../../../store/SceneStore";
import { autoPassKeys, useSettingsStore } from "../../../store/SettingsStore";

export const HostSettings = () => {
	const clientUuid = useAuthStore(store => store.clientUuid);
	const currentIntel = useBotStore((store) => store.currentIntel);
	const botCount = useBotStore((store) => store.botCount);
	const hostUuid = usePartyStore((store) => store.hostUuid);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);
	const allow3OfAKind = useSettingsStore((store) => store.allow3OfAKind);
	const allow2OfSpadesEnd = useSettingsStore((store) => store.allow2OfSpadesEnd);
	const autoPassIndex = useSettingsStore((store) => store.autoPassIndex);
	const endGameCondition = useSettingsStore((store) => store.endGameCondition);
	const scoreCalculation = useSettingsStore((store) => store.scoreCalculation);

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