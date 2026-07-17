import { useState, useRef, useEffect } from "react";
import { useSceneStore } from "../store/SceneStore";
import { ShowPasswordIcon } from "../components/icon/ShowPassword";
import { HidePasswordIcon } from "../components/icon/HidePassword";
import { CloseButton } from "../components/button/Close";

export const SignInWindow = () => {
	const { setShowWindow, setCurrentScene } = useSceneStore();

	const focusRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (focusRef.current)
			focusRef.current.focus();
	}, []);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		if (!email || !password) {
			setError("All fields are required");
			return;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError("Please enter a valid email address");
			return;
		}

		try {
			setIsLoading(true);

			const response = await fetch("/api/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "Invalid email or password");
			}

			setShowWindow("signIn", false);
			setCurrentScene("HOME");
		} catch (err) {
			if (err instanceof Error)
				setError(err.message);
			else
				setError("Something went wrong. Please try again");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<section className="
			absolute z-1 inset-0 left-0
			w-screen h-screen
			flex place-content-center place-items-center
		">
			<button tabIndex={-1} className='btn-lightbox' onClick={() => setShowWindow("signIn", false)}/>
			<form 
				onSubmit={handleSubmit}
				className="
					z-0
					bg-linear-to-b from-n0 to-n1
					border border-n2 rounded-3xl
					p-[clamp(1rem,5vw+0.25rem,2.5rem)]
					flex flex-col place-content-center place-items-center
					gap-2.5 sm:gap-3
					relative
					pointer-events-auto
			">
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
							placeholder="Enter your password"
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
				<button
					type="submit"
					className="btn-white hw-5/1 mt-5"
				>
					{ isLoading ? "SIGNING IN...": "SIGN IN" }
				</button>
				{ error && 
					<div className="text-r4 text-sm font-medium mt-5 w-full text-center">
						{error}
					</div>
				}
				<div className="
					absolute top-0 right-0 translate-x-1/2 -translate-y-1/2
					z-1
					w-12.5 h-12.5
				">
					<CloseButton dismiss={() => setShowWindow("signIn", false)} />
				</div>
			</form>
		</section>
	);
}