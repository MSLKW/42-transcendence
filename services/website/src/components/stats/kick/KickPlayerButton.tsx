import { partySocket } from "../../../api/party/partySocket";
import { usePartyStore } from "../../../store/PartyStore";
import { useAuthStore } from "../../../store/AuthStore";
import { KickIcon } from "./KickIcon";

interface KickPlayerButtonProps {
	playerUuid: string;
}

export const KickPlayerButton = ({ playerUuid }: KickPlayerButtonProps) => {
	const clientUuid = useAuthStore((store) => store.clientUuid);
	const hostUuid = usePartyStore((store) => store.hostUuid);
	const kickPlayer = usePartyStore((store) => store.kickPlayer);

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