import { useEffect } from "react";
import { chatSocket } from "../../api/chat/chatSocket";
import { partySocket } from "../../api/party/partySocket";
import { useAuthStore } from "../../store/AuthStore";
import { useBotStore } from "../../store/BotStore";
import { useBubbleStore } from "../../store/BubbleStore";
import { useChatStore } from "../../store/ChatStore";
import { useFriendStore } from "../../store/FriendStore";
import { useGameStore } from "../../store/GameStore";
import { usePartyStore } from "../../store/PartyStore";
import { useProfileStore } from "../../store/ProfileStore";
import { useResultsStore } from "../../store/ResultsStore";
import { useSceneStore } from "../../store/SceneStore";
import { BigLogo } from "./logo/BigLogo";
import { CreateAccountButton } from "./create_account/CreateAccountButton";
import { SignInButton } from "./sign_in/SignInButton";
import { useSettingsStore } from "../../store/SettingsStore";
import { useTypingStore } from "../../store/TypingStore";

export const LoginScene = () => {
	useEffect(() => {
		//reset values
		useAuthStore.getState().resetValues();
		useBotStore.getState().resetValues();
		useBubbleStore.getState().clearAllBubbles();
		useChatStore.getState().resetValues();
		useFriendStore.getState().resetValues();
		useGameStore.getState().resetValues();
		usePartyStore.getState().resetValues();
		useProfileStore.getState().resetValues();
		useResultsStore.getState().resetValues();
		useSceneStore.getState().resetValues();
		useSettingsStore.getState().resetValues();
		useTypingStore.getState().resetValues();

		//disconnect sockets
		chatSocket.disconnect();
		partySocket.disconnect();
	}, []);

	return (
		<>
			<main className="
				h-full w-full
				flex flex-col place-content-center
				pointer-events-none
				pt-[clamp(5rem,15.385vmin+0.385rem,10rem)]
			">
				<BigLogo />
			</main>
			<footer className="
				flex flex-col place-content-center place-items-center
				gap-2rem
				mb-[clamp(2.5rem,7.692vmin+0.192rem,5rem)]
			">
				<div className="
					flex place-content-center place-items-center
					gap-2rem
					flex-wrap
				">
					<CreateAccountButton />
					<SignInButton />
				</div>
				<button
					onClick={() => useSceneStore.getState().setCurrentScene("Home")}
					className="
						btn-text bg-clear
						h-3rem aspect-6/1
						text-1.25rem text-n6 hover:not-disabled:text-b5 focus-visible:text-b5
				">
					<u>PLAY AS GUEST</u>
				</button>
			</footer>
		</>
	);
}