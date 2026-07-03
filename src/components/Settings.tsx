import { useSceneStore } from "../store/useSceneStore";
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
	const contAreaWidth = useSceneStore((scene) => scene.contAreaWidth);
	const contAreaHeight = useSceneStore((scene) => scene.contAreaHeight);

	return (
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
			flex place-content-center place-items-center
		">
			<button tabIndex={-1} className='btn-lightbox' onClick={dismiss}/>
			<div className="
				z-0
				w-150 h-fit
				bg-n1
				border border-n2 rounded-3xl
				relative
				text-white
			">
				<div className="
					w-full h-full
					grid grid-cols-2 grid-rows-4
					border border-n2
				">
					<div className="
						col-span-1
						flex flex-col gap-5 content-stretch
						p-8
					">
						<p>Rules</p>
						<p>Allow Three of a Kind</p>
						<p>Allow Finish with 2 of Spades</p>
					</div>
					<div className="
						col-span-1
						flex flex-col gap-5
						p-8
					">
						<p>Auto Pass</p>
						<p>Time: 60s</p>
						<input type="range" />
					</div>
					<div className="
						col-span-1
						flex flex-col gap-5
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
					{/* <div className="
						col-span-2 row-span-1
						h-fit
						flex place-content-between place-items-center
						p-8
					">
						<p>Audio</p>
						<div className="group flex gap-5">
							<input type="radio" id="RadioFX"/>
							<label htmlFor="RadioFX">FX</label>
						</div>
						<div className="group flex gap-5">
							<input type="radio" id="RadioMusic"/>
							<label htmlFor="RadioMusic">Music</label>
						</div>
					</div> */}
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