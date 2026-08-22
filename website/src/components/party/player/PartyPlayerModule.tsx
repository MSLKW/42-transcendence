
import { partySocket } from "../../../api/party/partySocket";
import { useProfileStore } from "../../../store/ProfileStore";
import { PlayerStatusModule } from "../../player/status/PlayerStatusModule";
import { AvatarModule } from "../../avatar/AvatarModule";
import { InviteIcon } from "../invite/InviteIcon";
import { useFriendStore } from "../../../store/FriendStore";

interface PartyPlayerModuleProps {
	uuid: string;
}

export const PartyPlayerModule = ({ uuid }: PartyPlayerModuleProps) => {
	const { friends } = useFriendStore();
	const { clientUuid, getProfileData } = useProfileStore();
	const data = getProfileData(uuid);
	if (!data)
		return null;

	const relation = 
		friends.includes(uuid) ? "Friend" :
		clientUuid === uuid ? "Self" :
		"Stranger"
	;

	const handleInvite = () => {
		if ((data?.availability === "Online" && relation != "Self") || data?.availability === "Busy")
			return;
		partySocket.sendInvite(uuid, "Player");
	}

	return (
		<div
			className="
				flex place-content-center place-items-center
				gap-1rem
			"
		>
			<AvatarModule
				uuid={uuid}
				showName={false}
			/>
			<button
				data-tip="Send Invite"
				disabled={data?.availability === "Offline"}
				onClick={handleInvite}
				className={`
					h-full w-full
					py-0.5rem px-1.5rem
					${
						relation === "Self" ? "bg-party-self" :
						data?.availability === "Online" ? "bg-party-online" :
						data?.availability === "Offline" ? "bg-party-offline" :
						data?.availability === "Busy" ? "bg-party-busy" :
						undefined
					}
					flex flex-col gap-0.5rem
				`}
			>
				<h3>{data?.name}</h3>
				<div
					className={`
						flex
						${
							((data.availability === "Online" || data.availability === "Busy") && relation != "Self")
								? "place-content-between"
								: "place-content-center"
						}
						place-items-center
						gap-1rem
					`}
				>
					<PlayerStatusModule status={data?.availability!}/>
					{ (data.availability === "Online" || data.availability === "Busy") && relation != "Self" &&
						<div
							className="
								flex place-content-center place-items-center
								text-a4
								gap-0.5rem
							"
						>
							<InviteIcon />
							<p>Invite To Party</p>
						</div>
					}
				</div>
			</button>
		</div>
	);
}