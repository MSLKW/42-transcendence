import { useRef, useEffect } from "react";
import { handleGetSettings } from "../../../api/profile/get_settings/handleGetSettings";
import { useAuthStore } from "../../../store/AuthStore";
import { useGameStore } from "../../../store/GameStore";
import { usePartyStore } from "../../../store/PartyStore";
import { autoPassKeys, useSettingsStore } from "../../../store/SettingsStore";
import { Tooltip } from "../../../utilities/react/Tooltip";
import { ToggleButton } from "../toggle/ToggleButton";

export const HostSettings = () => {
	const gameStarted = useGameStore((store) => store.gameStarted);
	const clientUuid = useAuthStore(store => store.clientUuid);
	const hostUuid = usePartyStore((store) => store.hostUuid);
	const autoPassIndex = useSettingsStore((store) => store.autoPassIndex);
	const allow3OfAKind = useSettingsStore((store) => store.allow3OfAKind);
	const allow2OfSpadesEnd = useSettingsStore((store) => store.allow2OfSpadesEnd);

	const settingsFetched = useRef(false);
	useEffect(() => {
		if (!hostUuid || settingsFetched.current)
			return;
		settingsFetched.current = true;

		try {
			const fetchGetSettings = async () => {
				const response = await handleGetSettings(hostUuid);
				useSettingsStore.setState({
					allow3OfAKind: response.allow3OfAKind,
					allow2OfSpadesEnd: response.allow2OfSpadesEnd,
					autoPassIndex: response.autoPassIndex,
				});
			}
			fetchGetSettings();
		} catch(error) {
			console.error("Failed to fetch host settings:", error);
		}
	}, [hostUuid]);

	return (
		<Tooltip text="Rules set by host">
			<div
				tabIndex={-1}
				className={`
					w-max
					bg-n1/50 rounded-xl
					py-1.5rem px-2rem
					text-n6/80
					flex flex-col gap-1.5rem
					pointer-events-auto
			`}>
				<h1>Lobby Rules</h1>
				<label className="flex flex-col w-full gap-0.5rem cursor-pointer hover:scale-105">
					<h3 className="w-full"><b>Play Three of a Kind?</b></h3>
					<div className="flex place-content-start place-items-start w-full gap-1rem">
						<ToggleButton
							checked={allow3OfAKind}
							onChange={() => useSettingsStore.setState({ allow3OfAKind: !allow3OfAKind })}
							disabled={clientUuid !== hostUuid}
						/>
						<h3 className="text-a4 text-left">
							{ allow3OfAKind ? "Yes" : "No" }
						</h3>
					</div>
				</label>
				<label className="flex flex-col w-full gap-0.5rem cursor-pointer hover:scale-105">
					<h3 className="w-full"><b>Finish with 2 of Spades?</b></h3>
					<div className="flex place-content-start place-items-start w-full gap-1rem">
						<ToggleButton
							checked={allow2OfSpadesEnd}
							onChange={() => useSettingsStore.setState({ allow2OfSpadesEnd: !allow2OfSpadesEnd })}
							disabled={clientUuid !== hostUuid}
						/>
						<h3 className="text-a4 text-left">
							{ allow2OfSpadesEnd ? "Yes": "No" }
						</h3>
					</div>
				</label>
				<div className="flex flex-col gap-0.5rem">
					<label htmlFor="autoPassSlider">
						<h3 className={` ${ gameStarted && "opacity-50" } `}>
							<b>Auto Pass Time: <span className="text-a4 font-normal">{autoPassKeys[autoPassIndex]}</span></b>
						</h3>
					</label>
					<input
						type="range"
						id="autoPassSlider"
						min="0"
						max={autoPassKeys.length - 1}
						step="1"
						value={autoPassIndex}
						disabled={clientUuid !== hostUuid}
						onChange={ (e) => {
							const index = parseInt(e.target.value, 10);
							useSettingsStore.setState({ autoPassIndex: index });
						}}
						className="accent-b5 cursor-pointer"
					/>
				</div>
			</div>
		</Tooltip>
	);
}