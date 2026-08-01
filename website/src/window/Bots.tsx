import { useEffect } from "react";
import { useNotificationStore, notificationType } from "../store/NotificationStore";
import { Window } from "../components/window/Window";
import { AvatarMemberModule } from "../modules/AvatarMember";

export const BotsWindow = () => {
	const { showNotification } = useNotificationStore();
	
	useEffect(() => {
		showNotification("Select Bot Intelligence...", notificationType.botSelect);
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
				title="Bots"
				dismissKey="bots"
				hasHeader={false}
			>
				<div
					className="
						py-2rem px-3rem
						flex
					"
				>
					<AvatarMemberModule name="Beginner"/>
					<AvatarMemberModule name="Intermediate"/>
					<AvatarMemberModule name="Pro"/>
				</div>
			</Window>
		</>
	);
}