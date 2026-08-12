
import { partySocket } from "../../../api/party/partySocket";
import { useProfileStore } from "../../../store/ProfileStore";
import { PlayerStatusModule } from "../../player/status/PlayerStatusModule";
import { AvatarButton } from "../../avatar/AvatarButton";
import { FriendsIcon } from "./FriendsIcon";

interface FriendsProps {
	uuid: string,
}
export const FriendModule = ({ uuid }: FriendsProps) => {
	const { getProfileData } = useProfileStore();
	const data = getProfileData(uuid);
	if (!data)
		return null;

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
				uuid={uuid}
				showName={false}
			/>
			<button
				data-tip="Send Invite"
				disabled={data.availability === "Offline"}
				// onClick={((data.availability === "Online" && data.relation != "SELF") || data.availability === "Busy") ? handleInvite : undefined}
				onClick={(data.availability === "Online" || data.availability === "Busy") ? handleInvite : undefined}
				className={`
					h-full w-full
					py-0.5rem px-1.5rem
					${
						// data.relation === "SELF" ? "bg-party-self" :
						data.availability === "Online" ? "bg-party-online" :
						data.availability === "Offline" ? "bg-party-offline" :
						data.availability === "Busy" ? "bg-party-busy" :
						undefined
					}
					flex flex-col gap-0.5rem
				`}
			>
				<h3>{data.name}</h3>
				<div
						// ${ (data.availability === "Online" && profile.relation != "SELF") ? "place-content-between" : "place-content-center" }
					className={`
						flex
						${ data.availability === "Online" ? "place-content-between" : "place-content-center" }
						place-items-center
						gap-1rem
					`}
				>
					<PlayerStatusModule status={data.availability}/>
					{/* { profile.status === "ONLINE" && profile.relation != "SELF" && */}
					{ data.availability === "Online" &&
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