import { partySocket } from "../../../api/party/partySocket";
import { usePartyStore } from "../../../store/PartyStore";
import { useProfileStore } from "../../../store/ProfileStore";

export const KickMemberButton = () => {
	const { clientUuid } = useProfileStore();
	const { hostUuid } = usePartyStore();
	const handleKickMember = () => {
		partySocket.kickMember("12345678-abcd-efgh-ijkl-000000000000", "Player");
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