import { useEffect } from "react";
import { useNotificationStore, notificationType } from "../store/NotificationStore";
import { usePlayerStore } from "../store/PlayerStore";
import { AvatarNameModule } from "../modules/AvatarName";
import { AvatarSelectModule } from "../modules/AvatarSelectModule";
import { LightboxButton } from "../components/button/Lightbox";

export const SetupWindow = () => {
	const { data } = usePlayerStore();
	const { setNotification } = useNotificationStore();

	useEffect(() => {
		setNotification("Enter your name and choose your avatar", notificationType.nameInput);
	}, []);

	return (
		<section className="
			absolute z-1
			top-0 left-0
			h-full w-full
			flex place-content-center place-items-center
		">
			<LightboxButton
				dismiss={data.name ? "setup" : ""}
				blur={true}
				isDismissable={false}
			/>
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
		</section>
	);
}