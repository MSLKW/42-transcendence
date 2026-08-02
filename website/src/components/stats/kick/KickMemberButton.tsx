import { partySocket } from "../../../services/partySocket";

export const KickMemberButton = () => {
	const handleKickMember = () => {
		partySocket.kickMember("12345678-abcd-efgh-ijkl-000000000000", "Player");
	}
	return (
		<button
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