
import { partySocket } from "../../../services/partySocket";
import { usePartyStore } from "../../../store/PartyStore";
import { PlayerStatusModule, statusType } from "../../player/status/PlayerStatusModule";
import { AvatarButton } from "../../avatar/AvatarButton";
import { FriendsIcon } from "./FriendsIcon";

interface FriendsProps {
	name: string,
	status: number,
}
export const FriendModule = ({ name, status }: FriendsProps) => {
	const { members } = usePartyStore();
	const handleInvite = () => {
		partySocket.sendInvite("12345678-abcd-efgh-ijkl-000000000000", "Player");
	}

	return (
		<div
			className="
				flex place-content-center place-items-center
				gap-1rem
			"
		>
			<AvatarButton
				index={0}
				name={members[0].name ?? "Guest"}
				relation={members[0].relation}
				showName={false}
				isDisabled={status === statusType.offline}
			/>
			<button
				data-tip="Send Invite"
				disabled={status === statusType.offline}
				onClick={status === statusType.online ? handleInvite : undefined}
				className={`
					h-full w-full
					py-0.5rem px-1.5rem
					${
						status === statusType.online ? "bg-party-online" :
						status === statusType.offline ? "bg-party-offline" :
						"bg-party-unavailable"
					}
					flex flex-col gap-0.5rem
				`}
			>
				<h3>{name}</h3>
				<div
					className={`
						flex
						${status === statusType.online ? "place-content-between" : "place-content-center"}
						place-items-center
						gap-1rem
					`}
				>
					<PlayerStatusModule status={status}/>
					{ status === statusType.online &&
						<div
							className="
								flex place-content-center place-items-center
								text-a4
								gap-0.5rem
							"
						>
							<FriendsIcon />
							<p>Invite To Party</p>
						</div>
					}
				</div>
			</button>
		</div>
	);
}