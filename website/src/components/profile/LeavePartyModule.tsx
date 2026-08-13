import { partySocket } from "../../api/party/partySocket";
import { usePartyStore } from "../../store/PartyStore";

export const LeavePartyModule = () => {
	const { set1PlayerParty } = usePartyStore();
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
				Leave Party
			</button>
		</div>
	);
}