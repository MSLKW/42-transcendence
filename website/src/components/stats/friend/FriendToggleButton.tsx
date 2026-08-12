// import type { FriendData } from "../../../store/FriendStore";
import { UnfriendIcon } from "./UnfriendIcon";
import { AddFriendIcon } from "./AddFriendIcon";

interface FriendToggleButtonProps {
	// profile: FriendData;
}
// export const FriendToggleButton = ({ profile }: FriendToggleButtonProps) => {	
export const FriendToggleButton = () => {	
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
			{/* {profile.relation === "FRIEND" ? (
				<div className="flex gap-0.5rem place-items-center">
					<UnfriendIcon />
					<h3>Unfriend</h3>
				</div>
			) : (
				<div className="flex gap-0.5rem place-items-center">
					<AddFriendIcon />
					<h3>Add Friend</h3>
				</div>
			)} */}
		</button>
	);
}