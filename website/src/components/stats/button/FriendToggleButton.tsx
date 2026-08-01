import { useState } from "react";
import { UnfriendIcon } from "../../icon/Unfriend";
import { AddFriendIcon } from "../../icon/AddFriend";

export const FriendToggleButton = () => {
	const [isFriend, setIsFriend] = useState(false);
	
	return (
		<button
			className="
				h-12 w-50
				btn-text
				text-n0 border border-n5 bg-n6
				flex
				place-content-center place-items-center
			"
		>
			{isFriend ? (
				<>
					<div className="h-10 aspect-square"><UnfriendIcon /></div>
					<span>Unfriend</span>
				</>
			) : (
				<>
					<div className="h-10 aspect-square"><AddFriendIcon /></div>
					<span>Add Friend</span>
				</>
			)}
		</button>
	);
}