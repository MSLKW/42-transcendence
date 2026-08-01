// import { useEffect } from "react";
// import { useNotificationStore, notificationType } from "../store/NotificationStore";
import { useSceneStore } from "../store/SceneStore";
import { BigLogo } from "../components/logo/BigLogo";
import { CreateAccountButton } from "../components/button/CreateAccount";
import { SignInButton } from "../components/button/SignIn";

export const Login = () => {
	const { setCurrentScene } = useSceneStore();
	
	// const { showNotification } = useNotificationStore();
	// useEffect(() => {
	// 	const validateAuth = async () => {
	// 		try {
	// 			const response = await fetch("/api/auth/validate", {
	// 				method: "GET",
	// 				credentials: "include",
	// 			});

	// 			if (!response.ok) {
	// 				showNotification("Welcome to Big 2!", notificationType.message);
	// 				const errorData = await response.json().catch(() => ({}));
	// 				if (response.status === 401)
	// 					throw new Error("Missing or malformed authorization / invalid session");
	// 				else
	// 					throw new Error(errorData.message || "Authentication failed");
	// 			}
	// 			setCurrentScene("R3F");
	// 		} catch (err) {
	// 			if (err instanceof Error && !err.message.includes("401"))
	// 				showNotification(err.message, notificationType.message);
	// 		}
	// 	};
	// 	validateAuth();
	// }, [setCurrentScene, showNotification])

	return (
		<>
			<main
				className="
					h-full w-full
					flex flex-col place-content-center
					pointer-events-none
					pt-[clamp(5rem,15.385vmin+0.385rem,10rem)]
				"
			>
				<BigLogo />
			</main>
			<footer
				className="
					flex flex-col place-content-center place-items-center
					gap-[clamp(0.75rem,2.308vmin+0.058rem,1.5rem)]
					mb-[clamp(2.5rem,7.692vmin+0.192rem,5rem)]
				"
			>
				<div
					className="
						flex place-content-center place-items-center
						gap-[clamp(0.75rem,2.308vmin+0.058rem,1.5rem)]
						flex-wrap
					"
				>
					<CreateAccountButton />
					<SignInButton />
				</div>
				<button
					onClick={() => setCurrentScene("HOME")}
					className="
						btn-text bg-clear
						h-3rem aspect-6/1
						text-1.25rem text-n6 hover:not-disabled:text-b5 focus-visible:text-b5
					"
				>
					<u>PLAY AS GUEST</u>
				</button>
			</footer>
		</>
	);
}