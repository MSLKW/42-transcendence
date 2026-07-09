import { useSceneStore } from "../store/useSceneStore";
import { RankIcon } from "../icons/RankIcon";
import { RankArrowIcon } from "../icons/RankArrowIcon";
import { SpadesIcon, HeartsIcon, ClubsIcon, DiamondsIcon } from "../icons/SuitsIcons"

export const RankButton = () => {
	const setShowWindow = useSceneStore((scene) => scene.setShowWindow);

	return (
		<button
			data-tip="View Rank List"
			onClick={() => setShowWindow("rank", true)}
			className="
				w-max
				h-max
				btn-rank btn-icon-border btn-tip-down
				flex place-content-between place-items-center
		">
			<div className="
				h-full w-full
				px-[clamp(0.25rem,2vw+0.125rem,1.25rem)]
				text-n6
				relative
			">
				<p>Straight</p>
			</div>
			<div className="h-10 aspect-square text-b5">
				<RankIcon />
			</div>
		</button>
	);
}

export const RankWindow = () => {
	const setShowWindow = useSceneStore((scene) => scene.setShowWindow);

	return (
		<section className="
			absolute left-0 top-0
			z-1
			w-screen h-screen
		">
			<button tabIndex={-1} className='btn-lightbox-no-blur' onClick={() => setShowWindow("rank", false)}/>
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
						<p>4 of a Kind</p>
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
						w-7.5
						mr-5
						text-b3
					">
						<RankArrowIcon />
					</div>
				</div>
			</div>
		</section>
	);
}