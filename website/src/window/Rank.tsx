import { Window } from "./Window";
import { RankArrowIcon } from "../components/icon/RankArrow";
import { SpadesIcon, HeartsIcon, ClubsIcon, DiamondsIcon } from "../components/icon/Suits"

export const RankWindow = () => {
	return (
		<Window
			title={`Rank`}
			dismissKey="rank"
			pinState={false}
		>
			<div className="flex">
				<div className="
					px-1.5rem py-1rem
					flex gap-1rem
					rounded-bl-xl
				">
					<div className="
						flex place-items-center
						text-b5
					">
						<RankArrowIcon />
					</div>
					<div className="
						flex flex-col
						gap-1rem
						text-n6 text-right whitespace-nowrap
					">
						<h3>Straight Flush</h3>
						<h3>4 of a Kind</h3>
						<h3>Full House</h3>
						<h3>Flush</h3>
						<h3 className="text-b5">Straight</h3>
						<hr className="text-n2"/>
						<h3>Triple</h3>
						<h3>Double</h3>
						<h3>High Card</h3>
						<h3>Open</h3>
					</div>
				</div>
				<div
					className="
						flex gap-1rem
						bg-light
						rounded-br-xl
						px-1.5rem
					"
				>
					<div className="
						flex flex-col place-content-between
						py-1rem
					">
						<SpadesIcon />
						<HeartsIcon />
						<ClubsIcon />
						<DiamondsIcon />
					</div>
					<div className="
						flex place-items-center
						text-b3
					">
						<RankArrowIcon />
					</div>
				</div>
			</div>
		</Window>
	);
}