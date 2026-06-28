import { useEffect, useRef } from "react";
import { useSceneStore } from "../store/useSceneStore";
import { CloseButton } from "../components/CloseButton";

interface SignInProps {
	call?: () => void;
	dismiss?: () => void;
}

export const SignInButton = ({ call }: SignInProps) => {
	return (
		<button
			onClick={call}
			className="btn-text"
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
		<section style={{ width: contAreaWidth, height: contAreaHeight }}
			className="
				absolute z-1 inset-0 left-0
				w-full h-full
				flex place-content-center place-items-center
				"
		>
			<button tabIndex={-1} className='btn-lightbox' onClick={dismiss}/>
			<div className="
				z-0 relative
				w-max h-max
				bg-n1
				border border-n2 rounded-[clamp(0px,2vh,20px)]
				p-[clamp(0px,5vh,40px)]
				flex flex-col place-content-center place-items-center
				gap-10
			">
				{/* <div className="
					flex flex-col
					gap-2
				">
					<div className="grid grid-cols-[75px_1fr] gap-5 w-full">
						<label htmlFor="email">Email</label>
						<input
							ref={focusRef}
							id="email"
							type="email"
							placeholder="Enter your email"
						/>
					</div>
					<div className="grid grid-cols-[75px_1fr] gap-5 w-full">
						<label htmlFor="password">Password</label>
						<input
							id="password"
							type="password"
							placeholder="Enter your password"
						/>
					</div>
				</div> */}
				<div className="
					w-full h-full min-h-12.5
					flex place-content-center place-items-center
				">
					<button
						type="submit"
						className="
							btn-text
							h-12.5
					">
						SIGN IN
					</button>
				</div>
				{/* <div className="
					absolute z-1 top-0 right-0 translate-x-6.5 -translate-y-6.5
					w-12.5 h-12.5
				">
					<CloseButton dismiss={dismiss} />
				</div> */}
			</div>
		</section>
	);
}