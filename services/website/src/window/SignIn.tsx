import { useState, useRef, useEffect } from "react";
import { useNotificationStore, notificationType } from "../store/NotificationStore";
import { useSceneStore } from "../store/SceneStore";
import { Window } from "./Window";
import { ShowPasswordIcon } from "../components/icon/ShowPassword";
import { HidePasswordIcon } from "../components/icon/HidePassword";
import { io, Socket } from "socket.io-client";

export const SignInWindow = () => {
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
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!email || !password) {
			setNotification("All fields are required", notificationType.error);
			return;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setNotification("Please enter a valid email address", notificationType.error);
			return;
		}

		try {
			setIsLoading(true);

			const response = await fetch("/api/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ identifier: email, password }),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "Invalid email or password");
			}

			const socket = io("localhost", {
				path: "/socket/party"
			});

			socket.on("connect_error", (err) =>
			{
				console.log("failure!", err.message);
			});

			socket.on("connect", () =>
			{
				console.log("success!!!!!", `socket id: ${socket.id}`);
				setShowWindow("signIn", false);
				setCurrentScene("HOME");
			});

		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again";
			setNotification(errorMsg, notificationType.error);
		} finally {
			setIsLoading(false);
		}
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
							autoComplete="current-password"
							value={password}
							placeholder="Enter your password"
							onChange={(e) => setPassword(e.target.value)}
							className="input-form w-[70%]"
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
					{ isLoading ? "SIGNING IN...": "SIGN IN" }
				</button>
			</form>
		</Window>
	);
}