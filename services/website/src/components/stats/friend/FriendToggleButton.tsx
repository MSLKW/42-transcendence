import { useFriendsStore } from "../../../store/FriendsStore";
import { UnfriendIcon } from "./UnfriendIcon";
import { AddFriendIcon } from "./AddFriendIcon";

interface FriendToggleButtonProps {
	uuid: string;
}

export const FriendToggleButton = ({ uuid }: FriendToggleButtonProps) => {	
	const toggleFriend = useFriendsStore((store) => store.toggleFriend);
	const cachedFriends = useFriendsStore((store) => store.cachedFriends);

	return (
		<button
			onClick={() => toggleFriend(uuid)}
			className="
				h-4rem aspect-5/1
				btn-text bg-light
				text-n0
				flex place-content-center place-items-center
				gap-0.5rem
			"
		>
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