import { partySocket } from "../../api/party/partySocket";
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";

export const LeavePartyModule = () => {
	const { set1PlayerParty, hostUuid } = usePartyStore();
	const { clientUuid } = useProfileStore();
	const handleLeaveParty = () => {
		partySocket.leaveParty();
		set1PlayerParty();
	}

	return (
		<div
			className="
				flex place-content-center
				py-2rem px-1rem
			"
		>
			<button
				onClick={handleLeaveParty}
				className="
					btn-text bg-light
					h-3rem aspect-5/1
				"
			>
				{clientUuid === hostUuid ? "Disband Party" : "Leave Party"}
			</button>
		</div>
	);
}