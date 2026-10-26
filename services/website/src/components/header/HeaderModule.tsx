import { BackButton } from "./back/BackButton";
import { ChatButton } from "./chat/ChatButton";
import { EmoteGroup } from "./emote/EmoteGroup";
import { SignOutButton } from "./sign_out/SignOutButton";
import { NotifToggleButton } from "./notification/NotifToggleButton";
interface HeaderModuleProps {
	back: string;
}

export const HeaderModule = ({ back }: HeaderModuleProps) => {
	return (
		<header className="flex justify-between">
			<div className="flex rounded-full bg-dark-semi">
				{ back === "Login"
					? <SignOutButton />
					: <BackButton />
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