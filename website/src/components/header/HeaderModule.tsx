import { useSceneStore } from "../../store/SceneStore";
import { BackButton } from "./back/BackButton";
import { ChatButton } from "./chat/ChatButton";
import { EmojiButton } from "./emoji/EmojiButton";
import { SignOutButton } from "./sign_out/SignOutButton";
import { SettingsButton } from "./settings/SettingsButton";

interface HeaderModuleProps {
	back: string,
}

export const HeaderModule = ({ back }: HeaderModuleProps) => {
	const { currentScene, setCurrentScene } = useSceneStore();

	return (
		<header className="flex justify-between">
			<div className="flex rounded-full bg-dark">
				{ back === "Login"
					? <SignOutButton />
					: <BackButton scene={() => {
						if (currentScene === "Gameplay")
							setCurrentScene("Lobby");
						else
							setCurrentScene("Home");
					}}/> }
				<SettingsButton />
			</div>
			<div className="flex rounded-full bg-dark">
				<EmojiButton />
				<ChatButton />
			</div>
		</header>
	);
}