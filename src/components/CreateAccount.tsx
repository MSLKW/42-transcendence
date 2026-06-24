import { useSceneStore } from "../store/useSceneStore";
import { CloseIcon } from "../icons/CloseIcon";

interface CreateAccountProps {
	call?: () => void;
	dismiss?: () => void;
}

export const CreateAccountButton = ({ call }: CreateAccountProps) => {
	return (
		<button
			onClick={call}
			className="btn-clear"
		>
			<u>CREATE ACCOUNT</u>
		</button>
	);
}
export const CreateAccountLightbox = ({ dismiss }: CreateAccountProps) => {
	const contAreaWidth = useSceneStore((scene) => scene.contAreaWidth);
	const contAreaHeight = useSceneStore((scene) => scene.contAreaHeight);
	
	return (
		<section style={{ width: contAreaWidth, height: contAreaHeight }}
			className="
				absolute z-1 inset-0 left-0
				w-full h-full
				flex place-content-center place-items-center
				"
		>
			<button className='btn-lightbox' onClick={dismiss}/>
			<div className="z-0 w-max h-max relative">
				<div className="
					bg-n1 p-10
					border border-n2 rounded-3xl
					flex flex-col place-content-center place-items-center gap-2
				">
					<div className="grid grid-cols-[75px_1fr] gap-5 w-full">
						<label htmlFor="email">Email</label>
						<input
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
							placeholder="At least 8 characters"
						/>
					</div>
					<div className="grid grid-cols-[75px_1fr] gap-5 w-full">
						<label htmlFor="confirm">Confirm</label>
						<input
							id="confirm"
							type="password"
							placeholder="Confirm your password"
						/>
					</div>
					<button
						type="submit"
						className="btn-text mt-7.5"
					>
						CREATE ACCOUNT
					</button>
				</div>
				<button
					data-tip="Close"
					className="
						btn-icon
						absolute z-1 top-0 right-0 translate-x-6.5 -translate-y-6.5
						"
					onClick={dismiss}
				>
					<CloseIcon />
				</button>
			</div>
		</section>
	);
}