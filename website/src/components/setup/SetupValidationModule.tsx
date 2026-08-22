import { useProfileStore } from "../../store/ProfileStore";
import { useSceneStore } from "../../store/SceneStore";

interface SetupValidationModuleProps {
	name: string;
	avatar: string;
}

export const SetupValidationModule = ({ name, avatar }: SetupValidationModuleProps) => {
	const { createClientProfile } = useProfileStore();
	const { setShowWindow } = useSceneStore();

	const isValid = Boolean(name?.trim()) && Boolean(avatar);
	const handleSetupComplete = () => {
		if (!isValid)
			return;
		createClientProfile(name, avatar);
		setShowWindow("setup", false);
	};

	return (
		<div
			className="
				flex flex-col place-content-center place-items-center
				gap-1rem
				text-n6
				py-2rem
			"
		>
			<h3>
				{isValid ? `Welcome ${name}! You're all set up!` : "Enter your name and choose your avatar"}
			</h3>
			<button
				disabled={!isValid}
				onClick={handleSetupComplete}
				className="
					h-3rem aspect-10/1
					btn-text bg-white
					text-n0
				"
			>
				{isValid ? "Let's Play!" : "Waiting for valid name and avatar..."}
			</button>
		</div>
	);
}