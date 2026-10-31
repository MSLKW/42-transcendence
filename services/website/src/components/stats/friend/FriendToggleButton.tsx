import { useState, useEffect } from "react";
import { useFriendsStore } from "../../../store/FriendsStore";
import { UnfriendIcon } from "./UnfriendIcon";
import { AddFriendIcon } from "./AddFriendIcon";
import { handleFriendRequests } from "../../../api/friends/post_friend-requests/handleFriendRequests";
import { useAuthStore } from "../../../store/AuthStore";
import { handleDeleteFriendships } from "../../../api/friends/delete_friendships/handleDeleteFriendships";

type FRIEND_STATUS = "STRANGER" | "PENDING" | "FRIEND";

interface FriendToggleButtonProps {
	uuid: string;
	name: string;
}

export const FriendToggleButton = ({ uuid, name }: FriendToggleButtonProps) => {	
	const cachedFriends = useFriendsStore((store) => store.cachedFriends);
	const friendRequestSent = useFriendsStore((store) => store.friendRequestSent);
	const clientUuid = useAuthStore((store) => store.clientUuid);

	const [isFriend, setIsFriend] = useState<FRIEND_STATUS>("STRANGER");
	
	useEffect(() => {
		if (cachedFriends?.includes(uuid))
			setIsFriend("FRIEND");
		else if (friendRequestSent.includes(uuid))
			setIsFriend("PENDING");
		else
			setIsFriend("STRANGER");
	}, [cachedFriends, friendRequestSent]);

	const handleButtonClick = () => {
		if (isFriend === "FRIEND") {
			handleDeleteFriendships(clientUuid, uuid)
			setIsFriend("STRANGER");
		} else if (isFriend === "STRANGER") {
			handleFriendRequests(clientUuid, uuid, name);
			setIsFriend("PENDING");
		}
	};

	return (
		<button
			type="button"
			onClick={handleButtonClick}
			className="
				h-4rem aspect-5/1
				btn-text bg-light
				text-n0
				flex place-content-center place-items-center
				gap-0.5rem
		">
			{ isFriend === "FRIEND" ? (
				<>
					<UnfriendIcon />
					<h3>Unfriend</h3>
				</>
			) : (
				<>
					<AddFriendIcon />
					<h3>
						{isFriend === "STRANGER" ? "Add Friend" : "Pending Friend Request"}
					</h3>
				</>
			)}
		</button>
	);
}