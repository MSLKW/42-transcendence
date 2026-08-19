import { useGameStore } from "../../../store/GameStore";
import { AvatarModule } from "../../avatar/AvatarModule";

export const ResultsPodiumModule = () => {
	const { totalPlayers, seats, cardsLeft } = useGameStore();

	return (
		<div
			className="
				flex place-content-evenly
			"
		>
			{ seats[0] &&
				<div className="text-center flex flex-col gap-3">
					<AvatarModule key={seats[0]} uuid={seats[0]} cornerButton="1st"/>
					<span className={`${cardsLeft[0] > 0 ? "text-r4" : "text-c4"}`}>
						+{cardsLeft[0]}
					</span>
				</div>
			}
			{ totalPlayers >= 2 && seats[1] &&
				<div className="text-center flex flex-col gap-3">
					<AvatarModule key={seats[1]} uuid={seats[1]} cornerButton="2nd" />
					<span className={`${cardsLeft[1] > 0 ? "text-r4" : "text-c4"}`}>
						+{cardsLeft[1]}
					</span>
				</div>
			}
			{ totalPlayers >= 3 && seats[2] &&
				<div className="text-center flex flex-col gap-3">
					<AvatarModule key={seats[2]} uuid={seats[2]} cornerButton="3rd" />
					<span className={`${cardsLeft[2] > 0 ? "text-r4" : "text-c4"}`}>
						+{cardsLeft[2]}
					</span>
				</div>
			}
			{ totalPlayers >= 4 && seats[3] &&
				<div className="text-center flex flex-col gap-3">
					<AvatarModule key={seats[3]} uuid={seats[3]} cornerButton="4th" />
					<span className={`${cardsLeft[3] > 0 ? "text-r4" : "text-c4"}`}>
						+{cardsLeft[3]}
					</span>
				</div>
			}
		</div>
	);
}
