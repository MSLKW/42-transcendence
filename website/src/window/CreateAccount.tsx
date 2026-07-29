import { useState, useRef, useEffect } from "react";
import { useNotificationStore, notificationType } from "../store/NotificationStore";
import { useSceneStore } from "../store/SceneStore";
import { Window } from "./Window";
import { ShowPasswordIcon } from "../components/icon/ShowPassword";
import { HidePasswordIcon } from "../components/icon/HidePassword";
import { usePlayerStore } from "../store/PlayerStore";

export const CreateAccountWindow = () => {
	const { setShowWindow, setCurrentScene } = useSceneStore();
	const { setNotification } = useNotificationStore();
	const { setPlayerDataValue } = usePlayerStore();

	const focusRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (focusRef.current)
			focusRef.current.focus();
	}, []);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!email || !password || !confirmPassword) {
			setNotification("All fields are required", notificationType.error);
			return;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setNotification("Please enter a valid email address", notificationType.error);
			return;
		}
		if (password.length < 8) {
			setNotification("Password must be at least 8 characters", notificationType.error);
			return;
		}
		if (password !== confirmPassword) {
			setNotification("Passwords do not match", notificationType.error);
			return;
		}
		try {
			setIsLoading(true);
			const response = await fetch("/api/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				if (response.status === 400)
					throw new Error("Invalid email / password");
				else if (response.status === 409)
					throw new Error("An account with this email already exists");
				else
					throw new Error(errorData.message || "Failed to create account");
			}

			const data = await response.json();
			setPlayerDataValue("uuid", data.id);

			setShowWindow("createAccount", false);
			setCurrentScene("HOME");
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
			setNotification(errorMsg, notificationType.error);
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
					<label
						htmlFor="email"
						className="flex gap-5"
					>
						<h2 className="text-right w-[25%]">Email</h2>
						<input
							ref={focusRef}
							id="email"
							type="text"
							value={email}
							placeholder="Enter your email"
							onChange={(e) => setEmail(e.target.value)}
							className="input-form w-[70%]"
						/>
					</label>
					<label
						htmlFor="password"
						className="
							flex gap-5
							relative
						"
					>
						<h2 className="text-right w-[25%]">Password</h2>
						<input
							id="password"
							type={showPassword ? "text" : "password"}
							value={password}
							placeholder="At least 8 characters"
							onChange={(e) => setPassword(e.target.value)}
							className="input-form w-[70%]"
						/>
						<button
							type="button"
							tabIndex={-1}
							onClick={() => setShowPassword(!showPassword)}
							className="
								absolute right-1 top-1/2 -translate-y-1/2
								h-[80%] aspect-square
								text-n0
								btn-icon
								rounded-full
						">
							{ showPassword ? <ShowPasswordIcon /> : <HidePasswordIcon /> }
						</button>
					</label>
					<label
						htmlFor="confirm"
						className="
							flex gap-5
							relative
						"
					>
						<h2 className="text-right w-[25%]">
							Confirm
						</h2>
						<input
							id="confirm"
							type={showConfirmPassword ? "text" : "password"}
							value={confirmPassword}
							placeholder="Confirm your password"
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="input-form w-[70%]"
						/>
						<button
							type="button"
							tabIndex={-1}
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="
								absolute right-1 top-1/2 -translate-y-1/2
								h-[80%] aspect-square
								text-n0
								btn-icon
								rounded-full
						">
							{ showConfirmPassword ? <ShowPasswordIcon /> : <HidePasswordIcon /> }
						</button>
					</label>
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