import { useGameStore } from "../../store/GameStore";
import { useSceneStore } from "../../store/SceneStore";
import { useSettingsStore } from "../../store/SettingsStore";
import { BackButton } from "./back/BackButton";
import { ChatButton } from "./chat/ChatButton";
import { EmoteGroup } from "./emote/EmoteGroup";
import { SignOutButton } from "./sign_out/SignOutButton";
import { NotifToggleButton } from "./notification/NotifToggleButton";

interface HeaderModuleProps {
	back: string;
}

export const HeaderModule = ({ back }: HeaderModuleProps) => {
	const endGame = useGameStore((store) => store.endGame);
	const currentScene = useSceneStore((store) => store.currentScene);
	const setShowWindow = useSceneStore((store) => store.setShowWindow);

	const handleBackClick = () => {
		if (currentScene === "Game") {
			setShowWindow("leave", true);
			return;
		}
		endGame();
	};

	return (
		<header className="flex justify-between">
			<div className="flex rounded-full bg-dark-semi">
				{ back === "Login"
					? <SignOutButton />
					: <BackButton scene={handleBackClick} />
				}
				<NotifToggleButton />
			</div>
			<div className="flex rounded-full bg-dark-semi">
				<EmoteGroup />
				<ChatButton />
			</div>
		</header>
	);
}