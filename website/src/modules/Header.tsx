import { useSceneStore } from "../store/SceneStore";
import { BackButton } from "../components/button/Back";
import { ChatButton } from "../components/button/Chat";
import { EmojiButton } from "../components/button/Emoji";
import { SignOutButton } from "../components/button/SignOut";
import { SettingsButton } from "../components/button/Settings";

interface HeaderModuleProps {
	back: string,
}

export const HeaderModule = ({ back }: HeaderModuleProps) => {
	const { currentScene, setCurrentScene } = useSceneStore();

	return (
		<header className="flex justify-between">
			<div className="flex btn-icon bg-dark">
				{ back === "LOGIN"
					? <SignOutButton />
					: <BackButton scene={() => {
						if (currentScene === "LOBBY" || currentScene === "RESULTS")
							setCurrentScene("HOME");
						else if (currentScene === "R3F")
							setCurrentScene("LOBBY");
					}}/> }
				<SettingsButton />
			</div>
			<div className="flex btn-icon bg-dark">
				<EmojiButton />
				<ChatButton />
			</div>
		</header>
	);
}