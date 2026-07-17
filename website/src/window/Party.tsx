import { useRef } from "react";
import { useSceneStore } from "../store/SceneStore";
import { LightboxButton } from "../components/button/Lightbox";
import { PinButton } from "../components/button/Pin";
import { SendButton } from "../components/button/Send";

export const PartyWindow = () => {
	const { contAreaHeight, contAreaWidth } = useSceneStore();
	const focusRef = useRef<HTMLInputElement | null>(null);

	return (
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
		">
			<LightboxButton dismiss="party" blur={true} />
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
							<h2>Invite others</h2>
							<span className="text-lg">
								<span>Share Code: </span>
								<span className="tracking-[0.25rem]">
									<i>ABCD1234</i>
								</span>
							</span>
						</div>
						<hr className="text-a5"/>
						<div className="flex flex-col gap-[clamp(0.125rem,2vw+0.0625rem,0.75rem)]">
							<label htmlFor="party-code">
								<h2>Join another party</h2>
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