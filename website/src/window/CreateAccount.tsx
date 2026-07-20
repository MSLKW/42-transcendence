import { useState, useRef, useEffect } from "react";
import { useNotificationStore, notificationType } from "../store/NotificationStore";
import { useSceneStore } from "../store/SceneStore";
import { CloseModule } from "../modules/Close";
import { LightboxButton } from "../components/button/Lightbox";
import { ShowPasswordIcon } from "../components/icon/ShowPassword";
import { HidePasswordIcon } from "../components/icon/HidePassword";

export const CreateAccountWindow = () => {
	const { setShowWindow, setCurrentScene } = useSceneStore();
	const { setNotification } = useNotificationStore();

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

	const AUTH_URL = "http://localhost:3000";
	// const AUTH_URL = "localhost:3000";
	// const AUTH_URL = "/api/auth";

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
			// const response = await fetch("/api/auth/signup", {
			// const response = await fetch("http://localhost:3000/signup", {
			// const response = await fetch("localhost:3000/signup", {
			const response = await fetch(`${AUTH_URL}/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "Failed to create account");
			}

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
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
			flex place-content-center place-items-center
		">
			<LightboxButton dismiss="createAccount" blur={true} />
			<form
				onSubmit={handleSubmit}
				className="
					z-0
					bg-linear-to-b from-n0 to-n1
					border border-n2 rounded-3xl
					flex flex-col place-content-center place-items-center
					gap-2.5 sm:gap-3
					p-[clamp(1rem,5vw+0.25rem,2.5rem)]
					relative
					pointer-events-auto
			">
				<CloseModule dismiss="createAccount" />
				<label htmlFor="email" className="w-full flex place-content-between">
					<span className="text-right pr-5">Email</span>
					<input
						ref={focusRef}
						id="email"
						type="text"
						value={email}
						placeholder="Enter your email"
						onChange={(e) => setEmail(e.target.value)}
						className="input-form"
					/>
				</label>
				<label htmlFor="password" className="w-full flex place-content-between">
					<span className="text-right pr-5">
						Password
					</span>
					<div className="relative">
						<input
							id="password"
							type={showPassword ? "text" : "password"}
							value={password}
							placeholder="At least 8 characters"
							onChange={(e) => setPassword(e.target.value)}
							className="input-form w-full"
						/>
						<button
							type="button"
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
					</div>
				</label>
				<label htmlFor="confirm" className="w-full flex place-content-between">
					<span className="text-right pr-5">
						Confirm
					</span>
					<div className="relative">
						<input
							id="confirm"
							type={showConfirmPassword ? "text" : "password"}
							value={confirmPassword}
							placeholder="Confirm your password"
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="input-form w-full"
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword(!showPassword)}
							className="
								absolute right-1 top-1/2 -translate-y-1/2
								h-[80%] aspect-square
								text-n0
								btn-icon
								rounded-full
						">
							{ showPassword ? <ShowPasswordIcon /> : <HidePasswordIcon /> }
						</button>
					</div>
				</label>
				<button
					type="submit"
					disabled={isLoading}
					className="btn-white hw-5/1 mt-5"
				>
					{ isLoading ? "CREATING..." : "CREATE ACCOUNT" }
				</button>
			</form>
		</section>
	);
}