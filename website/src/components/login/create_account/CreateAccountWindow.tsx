import { useState } from "react";
import { useNotificationStore, notificationType } from "../../../store/NotificationStore";
import { usePlayerStore } from "../../../store/PlayerStore";
import { useSceneStore } from "../../../store/SceneStore";
import { Window } from "../../window/Window";
import { FormInputModule } from "../../form/FormInputModule";
import { signUpFetch } from "../../../api/authentication/signUpFetch";

export const CreateAccountWindow = () => {
	const { showNotification } = useNotificationStore();
	const { setPlayerDataValue } = usePlayerStore();
	const { setShowWindow, setCurrentScene } = useSceneStore();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!email || !password || !confirmPassword) {
			showNotification("All fields are required", notificationType.error);
			return;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			showNotification("Please enter a valid email address", notificationType.error);
			return;
		}
		if (password.length < 8) {
			showNotification("Password must be at least 8 characters", notificationType.error);
			return;
		}
		if (password !== confirmPassword) {
			showNotification("Passwords do not match", notificationType.error);
			return;
		}
		try {
			setIsLoading(true);
			const data = await signUpFetch(email, password);
			setPlayerDataValue("uuid", data.id);
			setShowWindow("createAccount", false);
			setCurrentScene("HOME");
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
			showNotification(errorMsg, notificationType.error);
		} finally {
			setIsLoading(false);
		}
	}
	
	return (
		<Window
			title="Create Account"
			dismissKey="createAccount"
		>
			<form
				onSubmit={handleSubmit}
				className="
					flex flex-col place-content-center place-items-center
					py-2rem px-3rem gap-2rem
					relative
					pointer-events-auto
			">
				<div className="flex flex-col gap-1rem">
					<FormInputModule
						label="Email"
						value={email}
						placeholder="Enter your email"
						inputFor="email"
						hasFocusRef={true}
						call={setEmail}
					/>
					<FormInputModule
						label="Password"
						value={password}
						placeholder="At least 8 characters"
						inputFor="password"
						isPassword={true}
						hasFocusRef={false}
						call={setPassword}
					/>
					<FormInputModule
						label="Confirm"
						value={confirmPassword}
						placeholder="Confirm your password"
						inputFor="confirmPassword"
						isPassword={true}
						hasFocusRef={false}
						call={setConfirmPassword}
					/>
				</div>
				<button
					type="submit"
					disabled={isLoading}
					className="
						btn-text bg-white
						h-3rem aspect-6/1
						text-1.25rem text-n0
					"
				>
					{ isLoading ? "CREATING..." : "CREATE ACCOUNT" }
				</button>
			</form>
		</Window>
	);
}