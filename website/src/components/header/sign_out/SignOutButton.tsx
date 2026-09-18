import { SignOutIcon } from "./SignOutIcon";
import { handleSignOut } from "../../../api/authentication/sign_out/handleSignOut";

export const SignOutButton = () => {
	return (
		<button
			data-tip="Sign Out"
			onClick={handleSignOut}
			className="btn-icon data-tip-down"
		>
				<SignOutIcon />
		</button>
	);
}