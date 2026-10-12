
import { useEffect, useState } from "react";
import { partySocket } from "../../../api/party/partySocket";
import { handleGetProfile } from "../../../api/profile/get_profile/handleGetProfile";
import { handleGetOnline } from "../../../api/party/get_online/handleGetOnline";
import { useAuthStore } from "../../../store/AuthStore";
import { useFriendStore } from "../../../store/FriendStore";
import { usePartyStore, type AVAILABILITY_TYPE } from "../../../store/PartyStore";
import type { UserData } from "../../../store/ProfileStore";
import { PlayerStatusModule } from "../../player/status/PlayerStatusModule";
import { AvatarModule } from "../../avatar/AvatarModule";
import { InviteIcon } from "../invite/InviteIcon";

interface PartyPlayerModuleProps {
	uuid: string;
}

export const PartyPlayerModule = ({ uuid }: PartyPlayerModuleProps) => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const cachedFriends = useFriendStore((store) => store.cachedFriends);
	const members = usePartyStore((store) => store.members);

	//get profile
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [availability, setAvailability] = useState<AVAILABILITY_TYPE | undefined>(undefined);
	const [playerData, setPlayerData] = useState<UserData | null>(null);
	useEffect(() => {
		let mounted = true;

		const getProfile = async () => {
			setIsLoading(true);
			const profile = await handleGetProfile(uuid);
			const online = await handleGetOnline(uuid); 
			if (mounted) {
				setPlayerData(profile);
				if (online.isOnline) {
					if (online.inParty)
						setAvailability("Busy");
					else
						setAvailability("Online");
				} else
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
						availability === "Busy" ? "bg-party-busy" :
						undefined
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