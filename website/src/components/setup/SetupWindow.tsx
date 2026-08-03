import { useState, useRef, useEffect } from "react";
import { useProfileStore } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";
import { Window } from "../window/Window";
import { AvatarInputModule } from "../avatar/AvatarInputModule";
import { AvatarSelectModule } from "../avatar/AvatarSelectModule";

export const SetupWindow = () => {
	const { data } = useProfileStore()
	const [isValid, setIsValid] = useState(Boolean(data.name?.trim()));
	const { setShowWindow } = useSceneStore();

	const inputRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (!data.name && inputRef.current)
			inputRef.current.focus();
	}, []);

	const submitButtonRef = useRef<HTMLButtonElement | null>(null);

	const handleSetupComplete = () => {
		if (isValid) {
			setShowWindow("setup", false)
		}
	}

	useEffect(() => {
		if (data.name && submitButtonRef.current)
			submitButtonRef.current.focus();
	}, []);

	return (
		<>
			<button
				className="
					fixed z-1 top-0 left-0
					h-screen w-screen
					backdrop-blur-xs
					pointer-events-none
				"
			/>
			<Window
				title="Setup"
				dismissKey="setup"
				hasHeader={false}
			>
				
				<div className="
					h-fit w-120
					bg-linear-to-b from-n0 to-n1
					border border-n1 rounded-xl
					relative
				">
					<div className="divide-y divide-n2">
						<AvatarInputModule
							setIsValid={setIsValid}
							inputRef={inputRef}
							submitButtonRef={submitButtonRef}
						/>
						<AvatarSelectModule />
					</div>
				</div>
				<hr />
				<div
					className="
						flex flex-col place-content-center place-items-center
						gap-1rem
						text-n6
						py-2rem
					"
				>
					<h3>Enter your name and choose your avatar</h3>
					<button
						ref={submitButtonRef}
						disabled={!isValid}
						onClick={handleSetupComplete}
						className="
							h-3rem aspect-8/1
							btn-text bg-white
							text-n0
						"
					>
						{isValid ? "Let's Play!" : "Waiting for valid name..."}
					</button>
				</div>
			</Window>
		</>
	);
}