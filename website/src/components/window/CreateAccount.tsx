import { useState, useRef, useEffect } from "react";
import { useSceneStore } from "../../store/SceneStore";
import { CloseButton } from "../button/Close";

export const CreateAccountWindow = () => {
	const { contAreaWidth, contAreaHeight, setShowWindow, setCurrentScene } = useSceneStore();

	const focusRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (focusRef.current)
			focusRef.current.focus();
	}, []);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		if (!email || !password || !confirmPassword) {
			setError("All fields are required");
			return;
		}
		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
		try {
			setIsLoading(true);
			const response = await fetch("/signup", {
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
			setError("Something went wrong. Please try again");
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
			<button type="button" tabIndex={-1} className='btn-lightbox' onClick={() => setShowWindow("createAccount", false)}/>
			<div style={{ width: contAreaWidth, height: contAreaHeight }} 
				className="
					z-0
					flex place-content-center place-items-center
					pointer-events-none
			">
				<form 
					onSubmit={handleSubmit}
					className="
						bg-n1
						border border-n2 rounded-3xl
						flex flex-col place-content-center place-items-center
						gap-2.5 sm:gap-3
						p-[clamp(1rem,5vw+0.25rem,2.5rem)]
						relative
						pointer-events-auto
				">
					<div className="grid grid-cols-1 sm:grid-cols-[5rem_1fr] gap-1 sm:gap-5 w-full">
						<label
							htmlFor="email"
							className="sm:justify-end"
						>
							Email
						</label>
						<input
							ref={focusRef}
							id="email"
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="input-form"
						/>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-[5rem_1fr] gap-1 sm:gap-5 w-full">
						<label
							htmlFor="password"
							className="sm:justify-end"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							placeholder="At least 8 characters"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="input-form"
						/>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-[5rem_1fr] gap-1 sm:gap-5 w-full">
						<label
							htmlFor="confirm"
							className="sm:justify-end"
						>
							Confirm
						</label>
						<input
							id="confirm"
							type="password"
							placeholder="Confirm your password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="input-form"
						/>
					</div>
					<button
						type="submit"
						disabled={isLoading}
						className="btn-white hw-5/1 mt-5"
					>
						{ isLoading ? "CREATING..." : "CREATE ACCOUNT" }
					</button>
					{error && 
						<div className="text-r4 text-sm font-medium mb-2 w-full text-center">
							{error}
						</div>
					}
					<div className="
						absolute top-0 right-0 translate-x-1/2 -translate-y-1/2
						z-1
						w-12.5 h-12.5
					">
						<CloseButton dismiss={() => setShowWindow("createAccount", false)} />
					</div>
				</form>
			</div>
		</section>
	);
}