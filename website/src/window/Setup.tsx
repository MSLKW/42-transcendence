import { useEffect } from "react";
import { useNotificationStore, notificationType } from "../store/NotificationStore";
import { Window } from "./Window";
import { AvatarNameModule } from "../modules/AvatarName";
import { AvatarSelectModule } from "../modules/AvatarSelectModule";

export const SetupWindow = () => {
	const { showNotification } = useNotificationStore();

	useEffect(() => {
		showNotification("Enter your name and choose your avatar", notificationType.nameInput);
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
						<AvatarNameModule />
						<AvatarSelectModule />
					</div>
				</div>
			</Window>
		</>
	);
}