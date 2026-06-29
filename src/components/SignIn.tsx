import { useEffect, useRef } from "react";
import { useSceneStore } from "../store/useSceneStore";
import { CloseButton } from "../components/CloseButton";

interface SignInProps {
	call?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	dismiss?: () => void;
}

export const SignInButton = ({ call }: SignInProps) => {
	return (
		<button
			onClick={call}
			className="btn-white"
		>
			SIGN IN
		</button>
	);
}

export const SignInLightbox = ({ dismiss }: SignInProps) => {
	const contAreaWidth = useSceneStore((scene) => scene.contAreaWidth);
	const contAreaHeight = useSceneStore((scene) => scene.contAreaHeight);
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
			<button tabIndex={-1} className='btn-lightbox' onClick={dismiss}/>
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
					gap-2.5 sm:gap-5
					p-10
					relative
					pointer-events-auto
				">
					<div className="grid grid-cols-1 sm:grid-cols-[5rem_1fr] gap-1 sm:gap-5 w-full">
						<label htmlFor="email">Email</label>
						<input
							ref={focusRef}
							id="email"
							type="email"
							placeholder="Enter your email"
							className="input-form"
						/>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-[5rem_1fr] gap-1 sm:gap-5 w-full">
						<label htmlFor="password">Password</label>
						<input
							id="password"
							type="password"
							placeholder="Enter your password"
							className="input-form"
						/>
					</div>
					<button
						type="submit"
						className="btn-white mt-7.5"
					>
						SIGN IN
					</button>
					<div className="
						absolute top-0 right-0 translate-x-1/2 -translate-y-1/2
						z-1
						w-12.5 h-12.5
					">
						<CloseButton dismiss={dismiss} />
					</div>
				</div>
			</div>
		</section>
	);
}