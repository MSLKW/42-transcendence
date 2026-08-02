import { useState } from "react";
import { UnfriendIcon } from "./UnfriendIcon";
import { AddFriendIcon } from "./AddFriendIcon";

export const FriendToggleButton = () => {
	const [isFriend, setIsFriend] = useState(false);
	
	return (
		<button
			className="
				h-4rem aspect-5/1
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