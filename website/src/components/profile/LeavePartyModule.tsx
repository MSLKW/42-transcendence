import { partySocket } from "../../services/partySocket";

export const LeavePartyModule = () => {
	return (
		<div
			className="
				flex place-content-center
				py-2rem px-1rem
			"
		>
			<button
				onClick={() => partySocket.leaveParty()}
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