import { useState } from "react";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { handleSignUp } from "../../../api/authentication/sign_up/handleSignUp";
import { Window } from "../../window/Window";
import { FormInputModule } from "../form/FormInputModule";

export const CreateAccountWindow = () => {
	const { showNotification } = useNotificationStore();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!email || !password || !confirmPassword) {
			showNotification("All fields are required", NOTIFICATION_TYPE.error);
			return;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			showNotification("Please enter a valid email address", NOTIFICATION_TYPE.error);
			return;
		}
		if (password.length < 8) {
			showNotification("Password must be at least 8 characters", NOTIFICATION_TYPE.error);
			return;
		}
		if (password !== confirmPassword) {
			showNotification("Passwords do not match", NOTIFICATION_TYPE.error);
			return;
		}
		handleSignUp(email, password, setIsLoading);
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