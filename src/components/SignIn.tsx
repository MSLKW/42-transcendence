import { useEffect, useRef } from "react";
import { useSceneStore } from "../store/useSceneStore";
import { CloseButton } from "../components/CloseButton";

export const SignInButton = () => {
	const setShowWindow = useSceneStore((scene) => scene.setShowWindow);

	return (
		<button
			onClick={() => setShowWindow("signIn", true)}
			className="btn-white hw-5/1"
		>
			SIGN IN
		</button>
	);
}

export const SignInWindow = () => {
	const setShowWindow = useSceneStore((scene) => scene.setShowWindow);
	
	const focusRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (focusRef.current) {
			focusRef.current.focus();
		}
	}, []);

	return (
		<section className="
			absolute z-1 inset-0 left-0
			w-screen h-screen
			flex place-content-center place-items-center
		">
			<button tabIndex={-1} className='btn-lightbox' onClick={() => setShowWindow("signIn", false)}/>
			<div className="
				z-0
				bg-linear-to-b from-n0 to-n1
				border border-n2 rounded-3xl
				p-[clamp(1rem,5vw+0.25rem,2.5rem)]
				flex flex-col place-content-center place-items-center
				gap-2.5 sm:gap-3
				relative
				pointer-events-auto
			">
				<label htmlFor="email">
					<span className="w-full text-right pr-5">Email</span>
					<input
						ref={focusRef}
						id="email"
						type="email"
						placeholder="Enter your email"
						className="input-form"
					/>
				</label>
				<label htmlFor="password">
					<span className="text-right pr-5">
						Password
					</span>
					<input
						id="password"
						type="password"
						placeholder="Enter your password"
						className="input-form"
					/>
				</label>
				<button
					type="submit"
					className="btn-white mt-5"
				>
					SIGN IN
				</button>
				<div className="
					absolute top-0 right-0 translate-x-1/2 -translate-y-1/2
					z-1
					w-12.5 h-12.5
				">
					<CloseButton dismiss={() => setShowWindow("signIn", false)} />
				</div>
			</div>
		</section>
	);
}