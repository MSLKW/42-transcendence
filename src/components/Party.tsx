import { useRef } from "react";
import { useSceneStore } from "../store/useSceneStore";
import { AddIcon } from "../icons/AddIcon";
import { PinButton } from "./PinButton";
import { SendButton } from "./SendButton";

export const JoinParty = () => {
	const setShowWindow = useSceneStore((scene) => scene.setShowWindow);

	return (
		<div className="
			flex flex-col place-items-center
			gap-1
		">
			<button
				data-tip="Add / Join Party"
				onClick={() => setShowWindow("party", true)}
				className="
					btn-tip-up-2
					h-[clamp(2.5rem,7.5vh+0.5rem,5rem)]
					aspect-square
					bg-n1
					border border-n2 rounded-sm
					text-b5
					p-3
					flex place-content-center place-items-center
			">
				<AddIcon />
			</button>
			<div className="
				w-max min-w-[clamp(2.5rem,7.5vh+0.5rem,5rem)] max-w-32.5
				h-fit
				bg-n1
				border border-n2 rounded-3xl
				text-[clamp(0.25rem,1.5vh+0.125rem,1rem)]
				text-n6
				truncate
				flex place-content-center place-items-center
				px-[clamp(0.625rem,1vh+0.3125rem,1.25rem)]
			">
				<p>Add</p>
			</div>
		</div>
	);
}

export const PartyLightbox = () => {
	const contAreaWidth = useSceneStore((scene) => scene.contAreaWidth);
	const contAreaHeight = useSceneStore((scene) => scene.contAreaHeight);
	const setShowWindow = useSceneStore((scene) => scene.setShowWindow);

	const focusRef = useRef<HTMLInputElement | null>(null);

	return (
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
		">
			<button tabIndex={-1} className='btn-lightbox-no-blur' onClick={() => setShowWindow("party", false)}/>
			<div style={{ width: contAreaWidth, height: contAreaHeight }}
				className="
					flex place-content-end place-items-end
					pb-[clamp(0.125rem,3.5vw+0.0625rem,3.125rem)] pr-[clamp(0.125rem,3.5vw+0.0625rem,3.125rem)]
					z-0
					w-full h-full
					mx-auto
					pointer-events-none
			">
				<div className="
					w-max h-max
					relative
				">
					<div className="
						w-full h-full
						bg-linear-to-b from-n0 to-n1
						border border-n2 rounded-[clamp(0.125rem,2vw+0.0625rem,1.5rem)]
						p-[clamp(0.25rem,2vw+0.125rem,1.875rem)]
						flex flex-col gap-[clamp(0.25rem,2vw+0.125rem,1.25rem)]
						text-n6
						pointer-events-auto
					">
						<div className="
							flex flex-col gap-[clamp(0.125rem,2vw+0.0625rem,0.25rem)]
							text-[clamp(0.5625rem,2.5vw+0.28125rem,1.125rem)]
						">
							<p><b>Invite others</b></p>
							<p>
								<span>Share Code: </span>
								<span className="tracking-[0.25rem]">
									<i>ABCD1234</i>
								</span>
							</p>
						</div>
						<hr className="text-a5"/>
						<div className="flex flex-col gap-[clamp(0.125rem,2vw+0.0625rem,0.75rem)]">
							<label htmlFor="party-code">
								<b>Join another party</b>
							</label>
							<div className="
								w-60 h-max
								flex place-content-center place-items-center
								gap-3
							">
								<input
									ref={focusRef}
									id="party-code"
									type="text"
									placeholder="Enter code"
									className="input-chat"
								/>
								<SendButton />
							</div>
						</div>
					</div>
					<div className="
						absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2
						z-1
						w-12.5 h-12.5
					">
						<PinButton/>
					</div>
				</div>
			</div>
		</section>
	);
}