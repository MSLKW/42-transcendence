import { useState } from "react";
import { useGameStore } from "../store/useGameStore";
import { SettingsIcon } from "../icons/SettingsIcon";
import { CloseButton } from "./CloseButton";
import { ToggleButton } from "./ToggleButton";
import { RadioButton } from "./RadioButton";

interface SettingsProps {
	call?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	dismiss?: () => void;
}

export const SettingsButton = ({ call }: SettingsProps) => {
	return (
		<button data-tip="Settings"
			onClick={call}
			className="btn-icon btn-tip-down"
		>
			<SettingsIcon />
		</button>
	);
}

export const SettingsLightbox = ({ dismiss }: SettingsProps) => {
	const gameStarted = useGameStore((state) => state.gameStarted);
	const allowThrees = useGameStore((state) => state.allowThrees);
	const setAllowThrees = useGameStore((state) => state.setAllowThrees);
	const allow2SpadesFinish = useGameStore((state) => state.allow2SpadesFinish);
	const setAllow2SpadesFinish = useGameStore((state) => state.setAllow2SpadesFinish);
	const autoPassValue = useGameStore((state) => state.autoPassValue);
	const setAutoPassValue = useGameStore((state) => state.setAutoPassValue);
	const autoPassText = useGameStore((state) => state.autoPassText);
	const gameEndCondition = useGameStore((state) => state.gameEndCondition);
	const setGameEndCondition = useGameStore((state) => state.setGameEndCondition);
	const scoreCalculation = useGameStore((state) => state.scoreCalculation);
	const setScoreCalculation = useGameStore((state) => state.setScoreCalculation);
	const pCardLook = useGameStore((state) => state.pCardLook);
	const setPCardLook = useGameStore((state) => state.setPCardLook);
	const uiColors = useGameStore((state) => state.uiColors);
	const setUIColors = useGameStore((state) => state.setUIColors);
	const fxLevel = useGameStore((state) => state.fxLevel);
	const setFXLevel = useGameStore((state) => state.setFXLevel);
	const mxLevel = useGameStore((state) => state.mxLevel);
	const setMXLevel = useGameStore((state) => state.setMXLevel);

	return (
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
			flex place-content-center place-items-center
		">
			<button tabIndex={-1} className='btn-lightbox' onClick={dismiss}/>
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
								checked={allowThrees}
								onChange={setAllowThrees}
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
								checked={allow2SpadesFinish}
								onChange={setAllow2SpadesFinish}
								disabled={gameStarted}
							/>
							<span>Allow Finish with 2 of Spades</span>
						</label>
					</div>
					<div className="
						col-span-1
						flex flex-col place-content-start
						gap-5
						px-8 py-5
					">
						<label htmlFor="autoPassSlider">
							<h2>Auto Pass Time: {autoPassText[autoPassValue]}</h2>
						</label>
						<input
							type="range"
							id="autoPassSlider"
							min="0"
							max={autoPassText.length - 1}
							step="1"
							value={autoPassValue}
							disabled={gameStarted}
							onChange={(e) => setAutoPassValue(parseInt(e.target.value, 10))}
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
								onChange={() => setGameEndCondition(0)}
								checked={gameEndCondition === 0}
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
								onChange={() => setGameEndCondition(1)}
								checked={gameEndCondition === 1}
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
								onChange={() => setScoreCalculation(0)}
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
								onChange={() => setScoreCalculation(1)}
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
						<h2>Playing Cards Look</h2>
						<label className="gap-5 cursor-pointer">
							<RadioButton
								name="pCardLook"
								value="modern"
								onChange={() => setPCardLook(0)}
								checked={pCardLook === 0}
							/>
							<span>Modern</span>
						</label>
						<label className="gap-5 cursor-pointer">
							<RadioButton
								name="pCardLook"
								value="classic"
								onChange={() => setPCardLook(1)}
								checked={pCardLook === 1}
							/>
							<span>Classic</span>
						</label>
					</div>
					<div className="
						col-span-1
						flex flex-col gap-2
						px-8
					">
						<h2>UI Colors</h2>
						<label className="gap-5 cursor-pointer">
							<RadioButton
								name="UIColors"
								value="main"
								onChange={() => setUIColors(0)}
								checked={uiColors === 0}
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
								onChange={() => setUIColors(1)}
								checked={uiColors === 1}
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
							onChange={(e) => {setFXLevel(parseFloat(e.target.value))}}
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
							onChange={(e) => {setMXLevel(parseFloat(e.target.value))}}
							className="accent-b5 cursor-pointer"
						/>
					</div>
				</div>
				<div className="
					absolute top-0 right-0 -translate-y-1/2 translate-x-1/2
					z-1
					w-12.5 h-12.5
				">
					<CloseButton dismiss={dismiss}/>
				</div>
			</div>
		</section>
	);
}