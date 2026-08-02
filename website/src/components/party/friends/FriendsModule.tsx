
import { partySocket } from "../../../services/partySocket";
import { AvatarButton } from "../../avatar/AvatarButton";
import { FriendsIcon } from "./FriendsIcon";
import { usePartyStore } from "../../../store/PartyStore";
import { PlayerStatusModule, statusType } from "../../player/status/PlayerStatusModule";

interface FriendsProps {
	name: string,
}
export const FriendModule = ({ name }: FriendsProps) => {
	const { members } = usePartyStore();
	const handleInvite = () => {
		partySocket.sendInvite("12345678-abcd-efgh-ijkl-000000000000", "Player");
	}

	return (
		<div
			className="
				flex place-content-center place-items-center
				gap-0.5rem
			"
		>
			<AvatarButton
				index={0}
				name={members[0].name ?? "Guest"}
				relation={members[0].relation}
				showName={false}
			/>
			<button
				data-tip="Send Invite"
				onClick={handleInvite}
				className="
					h-full w-full
					flex flex-col place-content-center place-items-between
					gap-0.5rem
					py-1rem px-1.5rem
					hover:bg-a2
					border border-a3 rounded-sm outline-b5
					hover:scale-105
					cursor-pointer
					data-tip-up
				"
			>
				<div className="flex place-content-between place-items-center">
					<h3>{name}</h3>
					<PlayerStatusModule status={statusType.unavailable}/>
				</div>
				{
					<div className="flex place-content-center place-items-center text-a4 gap-0.5rem">
						<FriendsIcon />
						<h3>Invite To Party</h3>
					</div>
				}
			</button>
		</div>
	);
}