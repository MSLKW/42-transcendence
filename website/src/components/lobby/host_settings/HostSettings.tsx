import { AUTO_PASS_RECORD, useSettingsStore } from "../../../store/SettingsStore";

export const HostSettings = () => {
	const { allow3OfAKind, allow2OfSpadesEnd, autoPassIndex, endGameCondition, scoreCalculation } = useSettingsStore();
	const autoPassKeys = Object.keys(AUTO_PASS_RECORD);

	return (
		<div
			className="
				w-max
				bg-n1/50
				rounded-xl
				py-1.5rem px-2rem
				text-n6/80
				flex flex-col
				gap-1rem
			"
		>
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
		</div>
	);
}