
import { useState, useRef, useEffect } from "react";
import { partySocket } from "../../../api/party/partySocket";
import { handleGetProfile } from "../../../api/profile/get_profile/handleGetProfile";
import { handleGetOnline } from "../../../api/party/get_online/handleGetOnline";
import { useAuthStore } from "../../../store/AuthStore";
import { useFriendStore } from "../../../store/FriendStore";
import { usePartyStore, type AVAILABILITY_TYPE } from "../../../store/PartyStore";
import type { UserData } from "../../../store/ProfileStore";
import { Tooltip } from "../../../utilities/react/Tooltip";
import { PlayerStatusModule } from "../../player/status/PlayerStatusModule";
import { AvatarModule } from "../../avatar/AvatarModule";
import { InviteIcon } from "../invite/InviteIcon";

interface PartyPlayerModuleProps {
	uuid: string;
}

export const PartyPlayerModule = ({ uuid }: PartyPlayerModuleProps) => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const hostUuid = usePartyStore((store) => store.hostUuid);
	const cachedFriends = useFriendStore((store) => store.cachedFriends);
	// const members = usePartyStore((store) => store.members);
	const availabilityOverride = usePartyStore((store) => store.availabilityOverrides[uuid]);

	//get profile
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [availability, setAvailability] = useState<AVAILABILITY_TYPE | null>(null);
	const [lastOnline, setLastOnline] = useState<Date | null>(null);
	const [playerData, setPlayerData] = useState<UserData | null>(null);

	const profileLoaded = useRef<string | null>(null);
	useEffect(() => {
		if (profileLoaded.current === uuid)
			return;
		profileLoaded.current = uuid;

		const getProfile = async () => {
			setIsLoading(true);

			try {
				const [profile, online] = await Promise.all([
					handleGetProfile(uuid),
					handleGetOnline(uuid),
				])

				setPlayerData(profile);
				if (online?.isOnline)
					setAvailability(online.inParty ? "Busy" : "Online");
				else {
					setAvailability("Offline");
					setLastOnline(online?.lastOnline ? new Date(online.lastOnline) : null);
				}
			} catch (error) {
				console.error("Failed to fetch player profile:", error);
			} finally {
				setIsLoading(false);
			}
		};
		getProfile();
	}, [uuid]);

	const effectiveAvailability = availabilityOverride ?? availability;

	const relation = 
		cachedFriends.includes(uuid) ? "Friend" :
		clientUuid === uuid ? "Self" :
		"Stranger";

	if (isLoading)
		return (<p>Loading player...</p>);

	if (!playerData)
		return (<p>Unable to load player</p>);

	return (
		<div className="
			flex place-content-center place-items-stretch
			gap-1rem
		">
			<AvatarModule
				uuid={uuid}
				image={playerData.avatarPath ?? undefined}
				showName={false}
			/>
			<Tooltip text={hostUuid === clientUuid ? "Send invite" : "Only host can invite"}>
				<button
					disabled={hostUuid !== clientUuid}
					onClick={() => partySocket.sendInvite(uuid, playerData?.username ?? "Player")}
					className={`
						h-auto min-w-60
						py-0.5rem px-1.5rem
						${
							relation === "Self" ? "bg-party-self" :
							effectiveAvailability === "Online" ? "bg-party-online" :
							effectiveAvailability === "Offline" ? "bg-party-offline" :
							effectiveAvailability === "Busy" ? "bg-party-busy" :
							undefined
						}
						flex flex-col gap-0.5rem flex-1
				`}>
					<h3>{playerData.username}</h3>
					<div className={`
						${
							((availability === "Online" || availability === "Busy") && relation != "Self")
								? "place-content-between"
								: "place-content-center"
						}
						flex place-items-center
						gap-1rem
					`}>
						<PlayerStatusModule
							uuid={uuid}
							availability={availability}
							lastOnline={lastOnline}
						/>
						{(effectiveAvailability === "Online" || effectiveAvailability === "Busy") && relation != "Self" &&
							<div className="
								flex place-content-center place-items-center
								text-a4
								gap-0.5rem
							">
								<InviteIcon />
								<p>Invite To Party</p>
							</div>
						}
					</div>
				</button>
			</Tooltip>
		</div>
	);
}