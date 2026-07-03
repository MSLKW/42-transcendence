import { useState } from "react";
import { SettingsIcon } from "../icons/SettingsIcon";
import { CloseButton } from "./CloseButton";

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
	)
}

export const SettingsLightbox = ({ dismiss }: SettingsProps) => {
	const autoPassOptions = ["1s", "3s", "5s", "10s", "15s", "30s", "42s", "1 min", "2 mins", "No Limit"];
	const [autoPassValue, setAutoPassValue] = useState(6);
	const [fxLevel, setFXLevel] = useState(75);
	const [musicLevel, setMusicLevel] = useState(50);
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

	return (
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
			flex place-content-center place-items-center
		">
			<button tabIndex={-1} className='btn-lightbox' onClick={dismiss}/>
			<div className="
				z-0
				w-170 h-fit
				bg-n1
				border border-n2 rounded-3xl
				relative
				text-white
			">
				<div className="
					w-full h-full
					grid grid-cols-2 grid-rows-4
				">
					<div className="
						col-span-1
						border-b border-r border-n2
						flex flex-col gap-5 content-stretch
						p-8
					">
						<p>Rules</p>
						<label className="gap-5">
							<input
								type="checkbox"
								checked={allowThrees}
								onChange={handleAllowThrees}
							/>
							<span>Allow Three of a Kind</span>
						</label>
						<label className="gap-5">
							<input
								type="checkbox"
								checked={allow2SpadeFinish}
								onChange={handleAllow2SpadeFinish}
							/>
							<span>Allow Finish with 2 of Spades</span>
						</label>
					</div>
					<div className="
						col-span-1
						flex flex-col gap-5
						border-b border-n2
						p-8
					">
						<p>Auto Pass</p>
						<label htmlFor="autoPassSlider" className="gap-2">
							Time: {autoPassOptions[autoPassValue]}
						</label>
						<input
							type="range"
							id="autoPassSlider"
							min="0"
							max={autoPassOptions.length - 1}
							value={autoPassValue}
							step="1"
							onChange={(e) => setAutoPassValue(parseInt(e.target.value, 10))}
						/>
					</div>
					<div className="
						col-span-1
						flex flex-col gap-5
						border-b border-r border-n2
						p-8
					">
						<p>Game ends...</p>
						<label className="flex gap-5">
							<input type="radio" name="game-ends" value="first"/>
							<span>When first player finish</span>
						</label>
						<label className="flex gap-5">
							<input type="radio" name="game-ends" value="last"/>
							<span>Until last hand remain</span>
						</label>
					</div>
					<div className="
						col-span-1
						flex flex-col gap-5
						border-b border-n2
						p-8
					">
						<p>Calculate score based on...</p>
						<label className="flex gap-5">
							<input type="radio" name="calculate-score" value="number"/>
							<span>Number of cards</span>
						</label>
						<label className="flex gap-5">
							<input type="radio" name="calculate-score" value="value"/>
							<span>Value of cards</span>
						</label>
					</div>
					<div className="
						col-span-1
						flex flex-col gap-5
						border-b border-r border-n2
						p-8
					">
						<p>Cards</p>
						<label className="flex gap-5">
							<input type="radio" name="cards" value="modern"/>
							<span>Modern</span>
						</label>
						<label className="flex gap-5">
							<input type="radio" name="cards" value="classic"/>
							<span>Classic</span>
						</label>
					</div>
					<div className="
						col-span-1
						flex flex-col space-y-5
						border-b border-n2
						p-8
					">
						<p>Colors</p>
						<label className="flex gap-5">
							<input type="radio" name="colors" value="main"/>
							<span>Main</span>
						</label>
						<label className="flex gap-5">
							<input type="radio" name="colors" value="alt"/>
							<span>Alt</span>
						</label>
					</div>
					<div className="
						col-span-1
						flex place-content-between place-items-center
						p-8
						border-r border-n2
					">
						<div className="flex flex-col gap-5">
							<label htmlFor="fxSlider">
								Sound FX: {fxLevel}%
							</label>
							<input
								type="range"
								id="fxSlider"
								min={0}
								max={100}
								step={1}
								value={fxLevel}
								onChange={(e) => {setFXLevel(parseFloat(e.target.value))}}
								className="w-full"
							/>
						</div>
					</div>
					<div className="
						col-span-1
						flex place-content-between place-items-center
						p-8
					">
						<div className="flex flex-col gap-5">
							<label htmlFor="musicSlider">
								Music: {musicLevel}%
							</label>
							<input
								type="range"
								id="musicSlider"
								min={0}
								max={100}
								step={1}
								value={musicLevel}
								onChange={(e) => {setMusicLevel(parseFloat(e.target.value))}}
								className="w-full"
							/>
						</div>
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