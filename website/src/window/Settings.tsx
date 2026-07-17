import { useGameStore } from "../store/GameStore";
import { useSceneStore } from "../store/SceneStore";
import { useSettingsStore, AUTO_PASS_LABELS } from "../store/SettingsStore";
import { CloseButton } from "../components/button/Close";
import { LightboxButton } from "../components/button/Lightbox";
import { RadioButton } from "../components/button/Radio";
import { ToggleButton } from "../components/button/Toggle";

export const SettingsWindow = () => {
	const { gameStarted } = useGameStore();
	const { setShowWindow } = useSceneStore();
	const {
		allow3OfAKind, allow2OfSpadesEnd, autoPassIndex, endGameCondition, scoreCalculation, cardStyle, uiColor, fxLevel, mxLevel,
		setSetting, toggleSetting,
	} = useSettingsStore();

	return (
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
			flex place-content-center place-items-center
		">
			<LightboxButton dismiss="settings" blur={true} />
			<div className="
				z-0
				text-n6
				bg-linear-to-b from-n0 to-n1
				border border-n2 rounded-3xl
				relative
			">
				<div className="
					w-full h-full
					grid grid-cols-1 md:grid-cols-2 grid-rows-auto
					pb-8
					max-h-[90vh] overflow-scroll
				">
					<div className="col-span-full md:grid-cols-2 row-span-1 pl-8 pt-8">
						<h1>Game Settings</h1>
					</div>
					<div className="
						col-span-1
						flex flex-col
						gap-2
						px-8 py-5
					">
						<label className={`
							gap-5
							cursor-pointer
							${gameStarted ? "opacity-50" : ""}
						`}>
							<ToggleButton 
								checked={allow3OfAKind}
								onChange={() => toggleSetting("allow3OfAKind")}
								disabled={gameStarted}
							/>
							<span>Allow Three of a Kind</span>
						</label>
						<label className={`
							gap-5
							cursor-pointer
							${gameStarted ? "opacity-50" : ""}
						`}>
							<ToggleButton 
								checked={allow2OfSpadesEnd}
								onChange={() => toggleSetting("allow2OfSpadesEnd")}
								disabled={gameStarted}
							/>
							<span>Allow Ending with 2 of Spades</span>
						</label>
					</div>
					<div className="
						col-span-1
						flex flex-col place-content-start
						gap-5
						px-8 py-5
					">
						<label htmlFor="autoPassSlider">
							<h2>Auto Pass Time: {AUTO_PASS_LABELS[autoPassIndex]}</h2>
						</label>
						<input
							type="range"
							id="autoPassSlider"
							min="0"
							max={AUTO_PASS_LABELS.length - 1}
							step="1"
							value={autoPassIndex}
							disabled={gameStarted}
							onChange={(e) => setSetting("autoPassIndex", parseInt(e.target.value, 10))}
							className="accent-b5 cursor-pointer"
						/>
					</div>
					<div className="
						col-span-1
						flex flex-col gap-2
						px-8 pt-5 mb-3 md:mb-0
					">
						<h2>Game Ends...</h2>
						<label className={`
							gap-5
							cursor-pointer
							${gameStarted ? "opacity-50" : ""}
						`}>
							<RadioButton
								name="game-ends"
								value="first-player"
								onChange={() => setSetting("endGameCondition", 0)}
								checked={endGameCondition === 0}
								disabled={gameStarted}
							/>
							<span>When first player finish</span>
						</label>
						<label className={`
							gap-5
							cursor-pointer
							${gameStarted ? "opacity-50" : ""}
						`}>
							<RadioButton
								name="game-ends"
								value="last-hand"
								onChange={() => setSetting("endGameCondition", 1)}
								checked={endGameCondition === 1}
								disabled={gameStarted}
							/>
							<span>Until last hand remain</span>
						</label>
					</div>
					<div className="
						col-span-1
						flex flex-col gap-2
						px-8 pt-5
					">
						<h2>Calculate Score Based On...</h2>
						<label className={`
							gap-5
							cursor-pointer
							${gameStarted ? "opacity-50" : ""}
						`}>
							<RadioButton
								name="calculate-score"
								value="number"
								onChange={() => setSetting("scoreCalculation", 0)}
								checked={scoreCalculation === 0}
								disabled={gameStarted}
							/>
							<span>Number of cards</span>
						</label>
						<label className={`
							gap-5
							cursor-pointer
							${gameStarted ? "opacity-50" : ""}
						`}>
							<RadioButton
								name="calculate-score"
								value="value"
								onChange={() => setSetting("scoreCalculation", 1)}
								checked={scoreCalculation === 1}
								disabled={gameStarted}
							/>
							<span>Value of cards</span>
						</label>
					</div>
					<hr className="col-span-full m-8 text-a4"/>
					<div className="
						col-span-1
						flex flex-col gap-2
						px-8 mb-8 md:mb-0
					">
						<h2>Playing Card Style</h2>
						<label className="gap-5 cursor-pointer">
							<RadioButton
								name="pCardLook"
								value="modern"
								onChange={() => setSetting("cardStyle", 0)}
								checked={cardStyle === 0}
							/>
							<span>Modern</span>
						</label>
						<label className="gap-5 cursor-pointer">
							<RadioButton
								name="pCardLook"
								value="classic"
								onChange={() => setSetting("cardStyle", 1)}
								checked={cardStyle === 1}
							/>
							<span>Classic</span>
						</label>
					</div>
					<div className="
						col-span-1
						flex flex-col gap-2
						px-8
					">
						<h2>UI Color</h2>
						<label className="gap-5 cursor-pointer">
							<RadioButton
								name="UIColors"
								value="main"
								onChange={() => setSetting("uiColor", 0)}
								checked={uiColor === 0}
							/>
							<div className="h-full aspect-1/2 flex border border-n6 overflow-clip">
								<div className="h-full aspect-square bg-b4"/>
								<div className="h-full aspect-square bg-a4"/>
							</div>
						</label>
						<label className="gap-5 cursor-pointer">
							<RadioButton
								name="UIColors"
								value="alt"
								onChange={() => setSetting("uiColor", 1)}
								checked={uiColor === 1}
							/>
							<div className="h-full aspect-1/2 flex border border-n6 overflow-clip">
								<div className="h-full aspect-square bg-d4"/>
								<div className="h-full aspect-square bg-c4"/>
							</div>
						</label>
					</div>
					<hr className="col-span-full m-8 text-a4"/>
					<div className="
						col-span-1
						flex flex-col
						gap-5
						px-8 mb-8 md:mb-0
					">
						<label htmlFor="fxSlider">
							<h2>Sound FX: {fxLevel}%</h2>
						</label>
						<input
							type="range"
							id="fxSlider"
							min={0}
							max={100}
							step={1}
							value={fxLevel}
							onChange={(e) => setSetting("fxLevel", parseFloat(e.target.value))}
							className="accent-b5 cursor-pointer"
						/>
					</div>
					<div className="
						col-span-1
						flex flex-col
						gap-5
						px-8
					">
						<label htmlFor="musicSlider">
							<h2>Music: {mxLevel}%</h2>
						</label>
						<input
							type="range"
							id="musicSlider"
							min={0}
							max={100}
							step={1}
							value={mxLevel}
							onChange={(e) => setSetting("mxLevel", parseFloat(e.target.value))}
							className="accent-b5 cursor-pointer"
						/>
					</div>
				</div>
				<div className="
					absolute top-0 right-0 -translate-y-1/2 translate-x-1/2
					z-1
					w-12.5 h-12.5
				">
					<CloseButton dismiss={() => setShowWindow("settings", false)}/>
				</div>
			</div>
		</section>
	);
}