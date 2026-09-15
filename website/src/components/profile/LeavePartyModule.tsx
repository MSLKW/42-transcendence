import { chatSocket } from "../../api/chat/chatSocket";
import { partySocket } from "../../api/party/partySocket";
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";

export const LeavePartyModule = () => {
	const { hostUuid } = usePartyStore();
	const { clientUuid } = useProfileStore();

	const handleLeaveParty = () => {
		partySocket.leaveParty();
		chatSocket.joinRoom(clientUuid!);
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