import { handlePutSettings } from "../../api/profile/put_settings/handlePutSettings";
import { useGameStore } from "../../store/GameStore";
import { useSceneStore } from "../../store/SceneStore";
import { useSettingsStore, autoPassKeys } from "../../store/SettingsStore";
import { Window } from "../window/Window";
import { RadioButton } from "./radio/RadioButton";
import { ToggleButton } from "./toggle/ToggleButton";

export const SettingsWindow = () => {
	const gameStarted = useGameStore((store) => store.gameStarted);
	const allow3OfAKind = useSettingsStore((store) => store.allow3OfAKind);
	const allow2OfSpadesEnd = useSettingsStore((store) => store.allow2OfSpadesEnd);
	const autoPassIndex = useSettingsStore((store) => store.autoPassIndex);
	const endGameCondition = useSettingsStore((store) => store.endGameCondition);
	const scoreCalculation = useSettingsStore((store) => store.scoreCalculation);
	const cardStyle = useSettingsStore((store) => store.cardStyle);
	const uiColor = useSettingsStore((store) => store.uiColor);
	const fxLevel = useSettingsStore((store) => store.fxLevel);
	const mxLevel = useSettingsStore((store) => store.mxLevel);
	const toggleSettingsValue = useSettingsStore((store) => store.toggleSettingsValue);

	const handleClose = () => {
		handlePutSettings({
			allow3OfAKind,
			allow2OfSpadesEnd,
			autoPassIndex,
			endGameCondition,
			scoreCalculation,
			cardStyle,
			uiColor,
			fxLevel,
			mxLevel,
		});
		useSceneStore.getState().setShowWindow("settings", false);
	}

	return (
		<Window
			title="Settings"
			dismissKey="settings"
			call={handleClose}
		>
			<div className="
				text-n6
				py-2rem px-2.5rem
				grid grid-cols-1 md:grid-cols-2 grid-rows-auto
				max-h-[90vh] overflow-scroll
				gap-2.5rem
			">
				<div className="
					col-span-1
					flex flex-col gap-0.5rem
				">
					<h3>Playing Card Style</h3>
					<label className="gap-5 cursor-pointer">
						<RadioButton
							name="pCardLook"
							value="modern"
							onChange={() => useSettingsStore.setState({ cardStyle: 0 })}
							checked={cardStyle === 0}
						/>
						<h3>Modern</h3>
					</label>
					<label className="gap-5 cursor-pointer">
						<RadioButton
							name="pCardLook"
							value="classic"
							onChange={() => useSettingsStore.setState({ cardStyle: 1 })}
							checked={cardStyle === 1}
						/>
						<h3>Classic</h3>
					</label>
				</div>
				<div className="
					col-span-1
					flex flex-col gap-0.5rem
				">
					<h3>UI Color</h3>
					<label className="gap-5 cursor-pointer">
						<RadioButton
							name="UIColors"
							value="main"
							onChange={() => useSettingsStore.setState({ uiColor: 0 })}
							checked={uiColor === 0}
						/>
						<div className="h-2rem aspect-1/2 flex border border-n6 overflow-clip">
							<div className="h-full aspect-square bg-b4"/>
							<div className="h-full aspect-square bg-a4"/>
						</div>
					</label>
					<label className="gap-5 cursor-pointer">
						<RadioButton
							name="UIColors"
							value="alt"
							onChange={() => useSettingsStore.setState({ uiColor: 1 })}
							checked={uiColor === 1}
						/>
						<div className="h-2rem aspect-1/2 flex border border-n6 overflow-clip">
							<div className="h-full aspect-square bg-d4"/>
							<div className="h-full aspect-square bg-c4"/>
						</div>
					</label>
				</div>
				<hr className="col-span-full text-n2/40"/>
				<div className="
					col-span-1
					flex flex-col gap-0.5rem
				">
					<label htmlFor="fxSlider">
						<h3>Sound FX: {fxLevel}%</h3>
					</label>
					<input
						type="range"
						id="fxSlider"
						min={0}
						max={100}
						step={1}
						value={fxLevel}
						onChange={(e) => useSettingsStore.setState({ fxLevel: parseFloat(e.target.value) })}
						className="accent-b5 cursor-pointer"
					/>
				</div>
				<div className="
					col-span-1
					flex flex-col gap-0.5rem
				">
					<label htmlFor="musicSlider">
						<h3>Music: {mxLevel}%</h3>
					</label>
					<input
						type="range"
						id="musicSlider"
						min={0}
						max={100}
						step={1}
						value={mxLevel}
						onChange={(e) => useSettingsStore.setState({ mxLevel: parseFloat(e.target.value) })}
						className="accent-b5 cursor-pointer"
					/>
				</div>
			</div>
		</Window>
	);
}