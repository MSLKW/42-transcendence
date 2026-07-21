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
	const { setCurrentScene } = useSceneStore();

	return (
		<header className="flex justify-between">
			<div className="flex btn-icon-border">
				{ back === "LOGIN" ? <SignOutButton /> : <BackButton scene={() => setCurrentScene("HOME")}/> }
				<SettingsButton />
			</div>
			<div className="flex btn-icon-border">
				<EmojiButton />
				<ChatButton />
			</div>
		</header>
	);
}