import { useState } from "react";
import { useNotificationStore, NOTIFICATION_TYPE } from "../../../store/NotificationStore";
import { Window } from "../../window/Window";
import { FormInputModule } from "../form/FormInputModule";
import { handleSignIn } from "../../../api/authentication/sign_in/handleSignIn";

export const SignInWindow = () => {
	const { showNotification } = useNotificationStore();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setIsLoading(true);
		if (!email || !password) {
			showNotification("All fields are required", NOTIFICATION_TYPE.error);
			return;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			showNotification("Please enter a valid email address", NOTIFICATION_TYPE.error);
			return;
		}

		await handleSignIn(email, password);
		setIsLoading(false);
	}

	return (
		<Window
			title="Sign In"
			dismissKey="signIn"
		>
			<form 
				onSubmit={handleSubmit}
				className="
					flex flex-col place-content-center place-items-center
					py-2rem px-3rem gap-2rem
					pointer-events-auto
				"
			>
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
					{ isLoading ? "SIGNING IN...": "SIGN IN" }
				</button>
			</form>
		</Window>
	);
}