import { handleSignOut } from "../../../api/authentication/sign_out/handleSignOut";
import { Tooltip } from "../../../utilities/react/Tooltip";
import { SignOutIcon } from "./SignOutIcon";

export const SignOutButton = () => {
	return (
		<button
			onClick={handleSignOut}
			className="btn-icon"
		>
			<Tooltip text="Sign out" position="bottom">
				<SignOutIcon />
			</Tooltip>
		</button>
	);
}