import { useSceneStore } from "../store/useSceneStore";
import { RankIcon } from "../icons/RankIcon";
import { PinButton } from "./PinButton";
import { RankArrowIcon } from "../icons/RankArrowIcon";
import { SpadesIcon, HeartsIcon, ClubsIcon, DiamondsIcon } from "../icons/SuitsIcons"

interface RankProps {
	call?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	dismiss?: () => void;
}

export const RankButton = ({ call }: RankProps) => {
	return (
		<button
			data-tip="Rank List"
			onClick={call}
			className="
				w-max
				h-max
				btn-icon-border btn-tip-down
				flex place-content-between place-items-center
		">
			<div className="
				w-full
				h-full
				text-n6
				px-[clamp(0.25rem,2vw+0.125rem,1.25rem)]
				relative
			">
				<p>Straight</p>
			</div>
			<div className="h-[40px] aspect-square text-b5">
				<RankIcon />
			</div>
		</button>
	);
}

export const RankLightbox = ({ dismiss }: RankProps) => {
	return (
		<section className="
			absolute left-0 top-0
			z-1
			w-screen h-screen
		">
			<button tabIndex={-1} className='btn-lightbox-no-blur' onClick={dismiss}/>
			<div className="
				z-0
				w-fit h-fit
				absolute top-[37.5%] left-1/2 -translate-x-1/2
				border border-n2 rounded-3xl
				flex
				overflow-hidden
			">
				<div className="
					w-fit
					h-fit
					flex items-stretch
					bg-n1
				">
					<div className="
						w-[30px]
						ml-5
						text-b5
					">
						<RankArrowIcon />
					</div>
					<div className="
						flex flex-col
						gap-3
						p-5
						text-n6 text-right whitespace-nowrap
					">
						<p>Straight Flush</p>
						<p>4 of a Kind + 1</p>
						<p>Full House</p>
						<p>Flush</p>
						<p className="text-b5">Straight</p>
						<hr className="text-n2"/>
						<p>Triple</p>
						<p>Double</p>
						<p>High Card</p>
						<p>Open</p>
					</div>
				</div>
				<div className="
					flex items-stretch
					bg-n6
				">
					<div className="
						h-full
						flex flex-col place-content-between
						p-5
					">
						<SpadesIcon />
						<HeartsIcon />
						<ClubsIcon />
						<DiamondsIcon />
					</div>
					<div className="
						w-[30px]
						mr-5
						text-b3
					">
						<RankArrowIcon />
					</div>
				</div>
			</div>
				{/* <div className="
					w-[80%] h-[80%]
					relative
				">
					<div tabIndex={-1}
						className="
							border border-n2 rounded-[clamp(0px,2vh,24px)]
							w-full h-full
							overflow-scroll
							pointer-events-auto
					">
						<div className="
							w-full h-[2000px]
							bg-linear-to-b from-a2 to-b2 
							p-10
							text-n6
							flex flex-col justify-between
						">
							<p>Start of rank section</p>
							<p>End of rank section</p>
						</div>
					</div>
					<div className="
						absolute top-0 right-0 -translate-y-1/2 translate-x-1/2
						z-1
						w-12.5 h-12.5
					">
						<PinButton />
					</div>*/}
			{/* </div> */}
		</section>
	);
}