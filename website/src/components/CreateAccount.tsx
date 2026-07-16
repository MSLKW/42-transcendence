import { useEffect, useRef } from "react";
import { useSceneStore } from "../store/SceneStore";
import { CloseButton } from "./button/CloseButton";

export const CreateAccountButton = () => {
	const setShowWindow =  useSceneStore((state) => state.setShowWindow);
	return (
		<button
			onClick={() => setShowWindow("createAccount", true)}
			className="btn-clear hw-5/1"
		>
			<u>CREATE ACCOUNT</u>
		</button>
	);
}

export const CreateAccountWindow = () => {
	const contAreaWidth = useSceneStore((scene) => scene.contAreaWidth);
	const contAreaHeight = useSceneStore((scene) => scene.contAreaHeight);

	const setShowWindow =  useSceneStore((state) => state.setShowWindow);

	const focusRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (focusRef.current) {
			focusRef.current.focus();
		}
	}, []);

	return (
		<section className="
			absolute z-1 top-0 left-0
			w-screen h-screen
			flex place-content-center place-items-center
		">
			<button tabIndex={-1} className='btn-lightbox' onClick={() => setShowWindow("createAccount", false)}/>
			<div style={{ width: contAreaWidth, height: contAreaHeight }} 
				className="
					z-0
					flex place-content-center place-items-center
					pointer-events-none
			">
				<div className="
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
							className="input-form"
						/>
					</div>
					<button
						type="submit"
						className="btn-white hw-5/1 mt-5"
					>
						CREATE ACCOUNT
					</button>
					<div className="
						absolute top-0 right-0 translate-x-1/2 -translate-y-1/2
						z-1
						w-12.5 h-12.5
					">
						<CloseButton dismiss={() => setShowWindow("createAccount", false)} />
					</div>
				</div>
			</div>
		</section>
	);
}