import { partySocket } from "../../../api/party/partySocket";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";

interface KickMemberButtonProps {
	playerUuid: string
}
export const KickMemberButton = ({ playerUuid }: KickMemberButtonProps) => {
	const { clientUuid } = useProfileStore();
	const { hostUuid, kickMember } = usePartyStore();
	const handleKickMember = () => {
		partySocket.kickMember(playerUuid, "Player");
		kickMember(playerUuid);
	}
	
	return (
		<button
			disabled={clientUuid !== hostUuid}
			onClick={handleKickMember}
			className="
				h-4rem aspect-5/1
				btn-text bg-light
				text-1.25rem text-n0
			"
		>
			Remove From Party
		</button>
	);
}