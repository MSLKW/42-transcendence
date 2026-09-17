import { chatSocket } from "../../api/chat/chatSocket";
import { partySocket } from "../../api/party/partySocket";
import { useAuthStore } from "../../store/AuthStore";

export const LeavePartyModule = () => {
	const clientUuid = useAuthStore((store) => store.clientUuid);

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