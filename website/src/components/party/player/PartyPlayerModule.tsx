
import { useEffect, useState } from "react";
import { partySocket } from "../../../api/party/partySocket";
import { handleGetProfile } from "../../../api/profile/get_profile/handleGetProfile";
import { handleOnline } from "../../../api/party/online/handleOnline";
import { useFriendStore } from "../../../store/FriendStore";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore, type UserData, type AVAILABILITY_TYPE } from "../../../store/ProfileStore";
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

	//get profile
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [availability, setAvailability] = useState<AVAILABILITY_TYPE | undefined>(undefined);
	const [playerData, setPlayerData] = useState<UserData | null>(null);
	useEffect(() => {
		let mounted = true;

		const getProfile = async () => {
			setIsLoading(true);
			const profile = await handleGetProfile(uuid);
			const online = await handleOnline(uuid); 
			if (mounted) {
				setPlayerData(profile);
				if (online.isOnline)
					setAvailability("Online");
				else
					setAvailability("Offline");
				setIsLoading(false);
			}
		};
		getProfile();

		return () => {
			mounted = false;
		};
	}, [uuid]);

	const relation = 
		cachedFriends.includes(uuid) ? "Friend" :
		clientUuid === uuid ? "Self" :
		"Stranger";

	const isDisabled = (relation === "Self" || members.includes(uuid) || availability === "Offline");

	const handleInvite = () => {
		if (isDisabled)
			return;
		partySocket.sendInvite(uuid, playerData?.username ?? "Player");
	}

	if (isLoading) {
		return (
			<div>
				<p>Loading player...</p>
			</div>
		);
	}

	if (!playerData) {
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
				image={playerData.avatarPath ?? undefined}
				showName={false}
			/>
			<button
				data-tip="Send Invite"
				disabled={isDisabled}
				onClick={handleInvite}
				className={`
					h-full w-full
					py-0.5rem px-1.5rem
					${
						relation === "Self" ? "bg-party-self" :
						availability === "Online" ? "bg-party-online" :
						availability === "Offline" ? "bg-party-offline" :
						undefined
						// data?.availability === "Online" ? "bg-party-online" :
						// data?.availability === "Offline" ? "bg-party-offline" :
						// data?.availability === "Busy" ? "bg-party-busy" :
						// undefined
					}
					flex flex-col gap-0.5rem
				`}
			>
				<h3>{playerData.username}</h3>
				<div
					className={`
						${
							((availability === "Online" || availability === "Busy") && relation != "Self")
								? "place-content-between"
								: "place-content-center"
						}
						place-content-center
						flex
						place-items-center
						gap-1rem
					`}
				>
					<PlayerStatusModule status={availability!}/>
					{(availability === "Online" || availability === "Busy") && relation != "Self" &&
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