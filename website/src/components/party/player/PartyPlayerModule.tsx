
import { useEffect, useState } from "react";
import { partySocket } from "../../../api/party/partySocket";
import { handleGetProfile } from "../../../api/profile/get_profile/handleGetProfile";
import { useFriendStore } from "../../../store/FriendStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore, type UserData } from "../../../store/ProfileStore";
import { PlayerStatusModule } from "../../player/status/PlayerStatusModule";
import { AvatarModule } from "../../avatar/AvatarModule";
import { InviteIcon } from "../invite/InviteIcon";

interface PartyPlayerModuleProps {
	uuid: string;
}

export const PartyPlayerModule = ({ uuid }: PartyPlayerModuleProps) => {
	const { cachedFriends } = useFriendStore();
	const { members } = usePartyStore();
	const { clientUuid } = useProfileStore();

	const [data, setData] = useState<UserData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		const loadProfile = async () => {
			setIsLoading(true);

			const profile = await handleGetProfile(uuid);

			if (mounted) {
				setData(profile);
				setIsLoading(false);
			}
		};
		loadProfile();

		return () => {
			mounted = false;
		};
	}, [uuid]);

	const relation = 
		cachedFriends.includes(uuid) ? "Friend" :
		clientUuid === uuid ? "Self" :
		"Stranger"
	;

	const isDisabled = (relation === "Self" || members.includes(uuid));

	const handleInvite = () => {
		if (isDisabled)
			return;
		partySocket.sendInvite(uuid, "Player");
	}

	if (isLoading) {
		return (
			<div>
				<p>Loading player...</p>
			</div>
		);
	}

	if (!data) {
		return (
			<div>
				<p>Unable to load player</p>
			</div>
		);
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
				image={data.avatarPath ?? undefined}
				showName={false}
			/>
			<button
				data-tip="Send Invite"
				// disabled={data?.availability === "Offline"}
				disabled={isDisabled}
				onClick={handleInvite}
				className={`
					h-full w-full
					py-0.5rem px-1.5rem
					${
						relation === "Self" ? "bg-party-self" :
						"bg-party-busy"
						// data?.availability === "Online" ? "bg-party-online" :
						// data?.availability === "Offline" ? "bg-party-offline" :
						// data?.availability === "Busy" ? "bg-party-busy" :
						// undefined
					}
					flex flex-col gap-0.5rem
				`}
			>
				<h3>{data.username}</h3>
				<div
						// ${
							// ((data.availability === "Online" || data.availability === "Busy") && relation != "Self")
								// ? "place-content-between"
								// : "place-content-center"
						// }
					className={`
						place-content-center
						flex
						place-items-center
						gap-1rem
					`}
				>
					{/* <PlayerStatusModule status={data?.availability!}/> */}
					<PlayerStatusModule status="Busy"/>
					{/* { (data.availability === "Online" || data.availability === "Busy") && relation != "Self" && */}
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
					{/* } */}
				</div>
			</button>
		</div>
	);
}