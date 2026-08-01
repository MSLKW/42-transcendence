import { partySocket } from "../../../services/partySocket";

export const KickMemberButton = () => {
	const handleKickMember = () => {
		partySocket.kickMember("12345678-abcd-efgh-ijkl-000000000000");
	}
	return (
		<button
			onClick={handleKickMember}
			className="
				h-3rem w-50 btn-text bg-n6 border border-n5 text-n0
			"
		>
			Remove From Party
		</button>
	);
}