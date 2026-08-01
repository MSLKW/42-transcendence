import { useDevStore } from "../../../store/DevStore";
// import { useNotificationStore, notificationType } from "../../store/NotificationStore";
// import { useSceneStore } from "../../store/SceneStore";
import { SignOutIcon } from "./SignOutIcon";

export const SignOutButton = () => {
	const { resetGame } = useDevStore();

	// const { setCurrentScene } = useSceneStore();
	// const { showNotification } = useNotificationStore();
	// const handleSignOut = async(e: React.MouseEvent<HTMLButtonElement>) => {
	// 	e.preventDefault();
	// 	console.log("Logging out...");

	// 	try {
	// 		const response = await fetch("/api/auth/logout", {
	// 			method: "DELETE",
	// 			credentials: "include",
	// 		});

	// 		if (!response.ok) {
	// 			const errorData = await response.json().catch(() => ({}));
	// 			if (response.status === 401)
	// 				throw new Error("Could not log out. Please try again");
	// 			else
	// 				throw new Error(errorData.message || "Invalid email or password");
	// 		}
	// 		setCurrentScene("LOGIN");
	// 		showNotification("Logged out successfully", notificationType.error);
	// 		console.log("Logged out successfully");
	// 	} catch (err) {
	// 		const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
	// 		showNotification(errorMsg, notificationType.error);
	// 	}
	// }

	return (
		<button
			data-tip="Sign Out"
			onClick={resetGame}
			// onClick={handleSignOut}
			className="btn-icon data-tip-down"
		>
				<SignOutIcon />
		</button>
	);
}