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
	const [allowThrees, setAllowThrees] = useState(false);
	const handleAllowThrees = () => {
		const newState = !allowThrees;
		setAllowThrees(newState);
	}
	const [allow2SpadeFinish, setAllow2SpadeFinish] = useState(false);
	const handleAllow2SpadeFinish = () => {
		const newState = !allow2SpadeFinish;
		setAllow2SpadeFinish(newState);
	}
	const autoPassOptions = ["1s", "3s", "5s", "10s", "15s", "30s", "42s", "1 min", "2 mins", "No Limit"];
	const [autoPassValue, setAutoPassValue] = useState(6);
	const [gameEnds, setGameEnds] = useState(0);
	const [calculateScore, setCalculateScore] = useState(0);
	const [pCardLook, setPCardLook] = useState(0);
	const [uiColors, setUIColors] = useState(0);
	const [fxLevel, setFXLevel] = useState(75);
	const [musicLevel, setMusicLevel] = useState(50);

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
								onChange={handleAllowThrees}
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
								checked={allow2SpadeFinish}
								onChange={handleAllow2SpadeFinish}
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
							<h2>Auto Pass Time: {autoPassOptions[autoPassValue]}</h2>
						</label>
						<input
							type="range"
							id="autoPassSlider"
							min="0"
							max={autoPassOptions.length - 1}
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
								onChange={() => setGameEnds(0)}
								checked={gameEnds === 0}
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
								onChange={() => setGameEnds(1)}
								checked={gameEnds === 1}
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
								onChange={() => setCalculateScore(0)}
								checked={calculateScore === 0}
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
								onChange={() => setCalculateScore(1)}
								checked={calculateScore === 1}
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
							<span>Main</span>
						</label>
						<label className="gap-5 cursor-pointer">
							<RadioButton
								name="UIColors"
								value="alt"
								onChange={() => setUIColors(1)}
								checked={uiColors === 1}
							/>
							<span>Alt</span>
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
							<h2>Music: {musicLevel}%</h2>
						</label>
						<input
							type="range"
							id="musicSlider"
							min={0}
							max={100}
							step={1}
							value={musicLevel}
							onChange={(e) => {setMusicLevel(parseFloat(e.target.value))}}
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