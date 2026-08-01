import { useGameStore } from "../store/GameStore";
import { useSettingsStore, AUTO_PASS_RECORD } from "../store/SettingsStore";
import { Window } from "../components/window/Window";
import { RadioButton } from "../components/button/Radio";
import { ToggleButton } from "../components/button/Toggle";

export const SettingsWindow = () => {
	const { gameStarted } = useGameStore();
	const {
		allow3OfAKind, allow2OfSpadesEnd, autoPassIndex, endGameCondition, scoreCalculation, cardStyle, uiColor, fxLevel, mxLevel,
		setSettingsValue, toggleSettingsValue,
	} = useSettingsStore();
	const autoPassKeys = Object.keys(AUTO_PASS_RECORD);

	return (
		<Window
			title="Settings"
			dismissKey="settings"
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
					flex flex-col gap-1rem
				">
					<label className={`
						gap-5
						cursor-pointer
						${gameStarted ? "opacity-50" : ""}
					`}>
						<ToggleButton 
							checked={allow3OfAKind}
							onChange={() => toggleSettingsValue("allow3OfAKind")}
							disabled={gameStarted}
						/>
						<h3>Allow Three of a Kind</h3>
					</label>
					<label className={`
						gap-5
						cursor-pointer
						${gameStarted ? "opacity-50" : ""}
					`}>
						<ToggleButton
							checked={allow2OfSpadesEnd}
							onChange={() => toggleSettingsValue("allow2OfSpadesEnd")}
							disabled={gameStarted}
						/>
						<h3>Allow Finish with 2 of Spades</h3>
					</label>
				</div>
				<div className="
					col-span-1
					flex flex-col gap-1rem
				">
					<label htmlFor="autoPassSlider">
						<h3 className={` ${ gameStarted && "opacity-50" } `}>
							Auto Pass Time: {autoPassKeys[autoPassIndex]}
						</h3>
					</label>
					<input
						type="range"
						id="autoPassSlider"
						min="0"
						max={autoPassKeys.length - 1}
						step="1"
						value={autoPassIndex}
						disabled={gameStarted}
						onChange={ (e) => {
							const index = parseInt(e.target.value, 10);
							setSettingsValue("autoPassIndex", index);
						}}
						className="accent-b5 cursor-pointer"
					/>
				</div>
				<div className="
					col-span-1
					flex flex-col gap-0.5rem
				">
					<h3 className={` ${ gameStarted && "opacity-50" } `}>Game Ends...</h3>
					<label className={`
						gap-5
						cursor-pointer
						${gameStarted ? "opacity-50" : ""}
					`}>
						<RadioButton
							name="game-ends"
							value="first-player"
							onChange={() => setSettingsValue("endGameCondition", 0)}
							checked={endGameCondition === 0}
							disabled={gameStarted}
						/>
						<h3>When first player finish</h3>
					</label>
					<label className={`
						gap-5
						cursor-pointer
						${gameStarted ? "opacity-50" : ""}
					`}>
						<RadioButton
							name="game-ends"
							value="last-hand"
							onChange={() => setSettingsValue("endGameCondition", 1)}
							checked={endGameCondition === 1}
							disabled={gameStarted}
						/>
						<h3>Until last hand remain</h3>
					</label>
				</div>
				<div className="
					col-span-1
					flex flex-col gap-0.5rem
				">
					<h3 className={` ${ gameStarted && "opacity-50" } `}>Calculate Score Based On...</h3>
					<label className={`
						gap-5
						cursor-pointer
						${gameStarted ? "opacity-50" : ""}
					`}>
						<RadioButton
							name="calculate-score"
							value="number"
							onChange={() => setSettingsValue("scoreCalculation", 0)}
							checked={scoreCalculation === 0}
							disabled={gameStarted}
						/>
						<h3>Number of cards</h3>
					</label>
					<label className={`
						gap-5
						cursor-pointer
						${gameStarted ? "opacity-50" : ""}
					`}>
						<RadioButton
							name="calculate-score"
							value="value"
							onChange={() => setSettingsValue("scoreCalculation", 1)}
							checked={scoreCalculation === 1}
							disabled={gameStarted}
						/>
						<h3>Value of cards</h3>
					</label>
				</div>
				<hr className="col-span-full text-a4"/>
				<div className="
					col-span-1
					flex flex-col gap-0.5rem
				">
					<h3>Playing Card Style</h3>
					<label className="gap-5 cursor-pointer">
						<RadioButton
							name="pCardLook"
							value="modern"
							onChange={() => setSettingsValue("cardStyle", 0)}
							checked={cardStyle === 0}
						/>
						<h3>Modern</h3>
					</label>
					<label className="gap-5 cursor-pointer">
						<RadioButton
							name="pCardLook"
							value="classic"
							onChange={() => setSettingsValue("cardStyle", 1)}
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
							onChange={() => setSettingsValue("uiColor", 0)}
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
							onChange={() => setSettingsValue("uiColor", 1)}
							checked={uiColor === 1}
						/>
						<div className="h-2rem aspect-1/2 flex border border-n6 overflow-clip">
							<div className="h-full aspect-square bg-d4"/>
							<div className="h-full aspect-square bg-c4"/>
						</div>
					</label>
				</div>
				<hr className="col-span-full text-a4"/>
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
						onChange={(e) => setSettingsValue("fxLevel", parseFloat(e.target.value))}
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
						onChange={(e) => setSettingsValue("mxLevel", parseFloat(e.target.value))}
						className="accent-b5 cursor-pointer"
					/>
				</div>
			</div>
		</Window>
	);
}