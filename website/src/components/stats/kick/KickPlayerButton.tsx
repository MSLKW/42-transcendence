import { partySocket } from "../../../api/party/partySocket";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";
import { KickIcon } from "./KickIcon";

interface KickPlayerButtonProps {
	playerUuid: string;
}

export const KickPlayerButton = ({ playerUuid }: KickPlayerButtonProps) => {
	const { clientUuid } = useProfileStore();
	const { hostUuid, kickPlayer } = usePartyStore();
	const handleKickPlayer = () => {
		partySocket.kickPlayer(playerUuid);
		kickPlayer(playerUuid);
	}
	
	return (
		<button
			disabled={clientUuid !== hostUuid}
			onClick={handleKickPlayer}
			className="
				h-4rem aspect-5/1
				btn-text bg-light
				text-n0
				flex place-content-center place-items-center
				gap-0.5rem
			"
		>
			<KickIcon />
			<h3>Kick From Party</h3>
		</button>
	);
}