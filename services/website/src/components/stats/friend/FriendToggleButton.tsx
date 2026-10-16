import { useFriendsStore } from "../../../store/FriendsStore";
import { UnfriendIcon } from "./UnfriendIcon";
import { AddFriendIcon } from "./AddFriendIcon";
import { handleFriendRequests } from "../../../api/friends/post_friend-requests/handleFriendRequests";
import { useAuthStore } from "../../../store/AuthStore";

interface FriendToggleButtonProps {
	uuid: string;
	name: string;
}

export const FriendToggleButton = ({ uuid, name }: FriendToggleButtonProps) => {	
	const cachedFriends = useFriendsStore((store) => store.cachedFriends);
	const clientUuid = useAuthStore((store) => store.clientUuid);

	return (
		<button
			onClick={() => handleFriendRequests(clientUuid!, uuid, name)}
			className="
				h-4rem aspect-5/1
				btn-text bg-light
				text-n0
				flex place-content-center place-items-center
				gap-0.5rem
		">
			{ cachedFriends.includes(uuid) ? (
				<>
					<UnfriendIcon />
					<h3>Unfriend</h3>
				</>
			) : (
				<>
					<AddFriendIcon />
					<h3>Add Friend</h3>
				</>
			)}
		</button>
	);
}