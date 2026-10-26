import { useState } from "react";
import { useAuthStore } from "../../../store/AuthStore";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { handleSignUp } from "../../../api/authentication/post_signup/handleSignUp";
import { Window } from "../../window/Window";
import { FormInputModule } from "../form/FormInputModule";

export const CreateAccountWindow = () => {
	const authValidation = useAuthStore((store) => store.authValidation);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (authValidation) {
			if (!email || !password || !confirmPassword) {
				useNotificationStore.getState().showNotification("All fields are required", NOTIFICATION_TYPE.error);
				return;
			}
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				useNotificationStore.getState().showNotification("Please enter a valid email address", NOTIFICATION_TYPE.error);
				return;
			}
			if (password.length < 8) {
				useNotificationStore.getState().showNotification("Password must be at least 8 characters", NOTIFICATION_TYPE.error);
				return;
			}
			if (password !== confirmPassword) {
				useNotificationStore.getState().showNotification("Passwords do not match", NOTIFICATION_TYPE.error);
				return;
			}
		}

		setIsLoading(true);
		try {
			await handleSignUp(email, password, setIsLoading);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Window
			title="Create Account"
			dismissKey="createAccount"
			lightbox={true}
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