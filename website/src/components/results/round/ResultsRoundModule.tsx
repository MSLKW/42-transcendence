import { useGameStore } from "../../../store/GameStore";
import { usePartyStore } from "../../../store/PartyStore";
import { AvatarImage } from "../../avatar/image/AvatarImage";

export const ResultsRoundModule = () => {
	const { totalPlayers, seats } = useGameStore();
	const { members, getMemberData } = usePartyStore();

	return (
		<>
			<div className="
				row-start-1 row-end-1
				flex place-content-center place-items-center
				h-full w-full
				border-t border-r border-n2/40
			">
				<h2>Rounds Played: 2</h2>
			</div>
			<div className="
				row-start-2 row-end-2
				flex place-items-center
				gap-5
				h-full w-full
				bg-b2
				border-r border-n2/40
			">
				<AvatarImage />
				<div className="flex flex-col place-content-center place-items-start">
					<h3>{getMemberData(seats[0])?.name}</h3>
					<p>Total Wins: 1</p>
				</div>
			</div>
			{ totalPlayers >= 2 && members[1] && members[1].name &&
				<div className="
					row-start-3 row-end-3
					flex place-items-center
					gap-5
					h-full w-full
					border-r border-n2/40
				">
					<AvatarImage />
					<div className="flex flex-col place-content-center place-items-start">
						<h3>{members[1].name}</h3>
						<p>Total Wins: 1</p>
					</div>
				</div>
			}
			{ totalPlayers >= 3 && members[2] && members[2].name &&
				<div className="
					row-start-4 row-end-4
					flex place-items-center
					gap-5
					h-full w-full
					border-r border-n2/40
				">
					<AvatarImage />
					<div className="flex flex-col place-content-center place-items-start">
						<h3>{members[2].name}</h3>
						<p>Total Wins: 0</p>
					</div>
				</div>
			}
			{ totalPlayers >= 4 && members[3] && members[3].name &&
				<div className="
					row-start-5 row-end-5
					flex place-items-center
					gap-5
					h-full w-full
					border-r border-n2/40
				">
					<AvatarImage />
					<div className="flex flex-col place-content-center place-items-start">
						<h3>{members[3].name}</h3>
						<p>Total Wins: 0</p>
					</div>
				</div>
			}
		</>
	);
}