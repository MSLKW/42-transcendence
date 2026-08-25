import { useGameStore } from "../../../store/GameStore";
import { usePartyStore } from "../../../store/PartyStore";
import { AvatarModule } from "../../avatar/AvatarModule";

export const ResultsPodiumModule = () => {
	const { totalPlayers } = useGameStore();
	const { members } = usePartyStore();

	return (
		<div
			className="
				flex place-content-evenly
			"
		>
			{ members[0] && members[0].uuid &&
				<div className="text-center flex flex-col gap-3">
					<AvatarModule key={members[0].uuid} uuid={members[0].uuid} cornerButton="1st"/>
					<span className="text-b5">+0</span>
				</div>
			}
			{ members[1] && members[1].uuid &&
				<div className="text-center flex flex-col gap-3">
					<AvatarModule key={members[1].uuid} uuid={members[1].uuid} cornerButton="2nd" />
					<span className="text-r4">+6</span>
				</div>
			}
			{ totalPlayers >= 3 && members[2] && members[2].uuid &&
				<div className="text-center flex flex-col gap-3">
					<AvatarModule key={members[2].uuid} uuid={members[2].uuid} cornerButton="3rd" />
					<span className="text-r4">+8</span>
				</div>
			}
			{ totalPlayers >= 4 && members[3] && members[3].uuid &&
				<div className="text-center flex flex-col gap-3">
					<AvatarModule key={members[3].uuid} uuid={members[3].uuid} cornerButton="4th" />
					<span className="text-r4">+15</span>
				</div>
			}
		</div>
	);
}
